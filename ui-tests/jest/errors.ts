import { AggregatedResult } from '@jest/test-result';
import { MatchError, MatchSuccess, Paths } from './matchers';

export abstract class ErrorCollector {
  constructor(protected projects: Env.Projects) {}

  abstract collect(results: AggregatedResult): Map<string, ErrorReport>;
}

export class DefaultErrorCollector extends ErrorCollector {
  collect(results: AggregatedResult) {
    const errorReports = new Map<string, ErrorReport>();

    results.testResults.forEach(result => {
      if (!result.numFailingTests) return;

      result.testResults.forEach(testResult => {
        if (testResult.status !== 'failed') return;

        testResult.failureDetails.forEach(failure => {
          const { matcherResult } = failure as ScreenshotDiffError;

          if (!matcherResult || matcherResult.pass) return; // Timeout or Success

          const project = this.resolveProjectFromScreenshot(matcherResult.paths.diff);

          if (!project) return; // Project not found

          const report = errorReports.get(project.name) ?? new ErrorReport(project);

          const suiteTitle = testResult.ancestorTitles.join(' ▸ ');
          const suite = new Suite(suiteTitle);

          const specTitle = testResult.title;
          const spec = new Spec(specTitle);

          const error = new SpecError(testResult.failureMessages, matcherResult.paths);

          spec.registerError(error);
          suite.registerSpec(spec);
          report.registerSuite(suite);
          errorReports.set(project.name, report);
        });
      });
    });

    return errorReports;
  }

  private resolveProjectFromScreenshot(screenshot: string) {
    return Object.values(this.projects).find(project =>
      screenshot.replace(/\\/gi, '/').startsWith(`screenshots/${project.path}`),
    );
  }
}

export class ErrorReport {
  constructor(public readonly project: Env.Project) {}

  readonly errors: SpecError[] = [];

  readonly suites = new Map<string, Suite>();

  registerSuite = (suite: Suite) => {
    const registered = this.suites.get(suite.title);

    if (registered) suite.specs.forEach(registered.registerSpec);
    else this.suites.set(suite.title, suite);

    this.errors.push(...suite.errors);
  };
}

class Suite {
  constructor(public readonly title: string) {}

  readonly errors: SpecError[] = [];

  readonly specs = new Map<string, Spec>();

  registerSpec = (spec: Spec) => {
    const registered = this.specs.get(spec.title);

    if (registered) spec.errors.forEach(registered.registerError);
    else this.specs.set(spec.title, spec);

    this.errors.push(...spec.errors);
  };
}

class Spec {
  constructor(public readonly title: string) {}

  readonly errors: SpecError[] = [];

  registerError = (error: SpecError) => {
    this.errors.push(error);
  };
}

class SpecError {
  constructor(public readonly details: string[], public readonly screenshots: Paths) {}
}

interface ScreenshotDiffError {
  matcherResult: MatchError | MatchSuccess;
}
