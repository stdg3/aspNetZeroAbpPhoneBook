"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorReport = exports.DefaultErrorCollector = exports.ErrorCollector = void 0;
class ErrorCollector {
    constructor(projects) {
        this.projects = projects;
    }
}
exports.ErrorCollector = ErrorCollector;
class DefaultErrorCollector extends ErrorCollector {
    collect(results) {
        const errorReports = new Map();
        results.testResults.forEach(result => {
            if (!result.numFailingTests)
                return;
            result.testResults.forEach(testResult => {
                if (testResult.status !== 'failed')
                    return;
                testResult.failureDetails.forEach(failure => {
                    var _a;
                    const { matcherResult } = failure;
                    if (!matcherResult || matcherResult.pass)
                        return; // Timeout or Success
                    const project = this.resolveProjectFromScreenshot(matcherResult.paths.diff);
                    if (!project)
                        return; // Project not found
                    const report = (_a = errorReports.get(project.name)) !== null && _a !== void 0 ? _a : new ErrorReport(project);
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
    resolveProjectFromScreenshot(screenshot) {
        return Object.values(this.projects).find(project => screenshot.replace(/\\/gi, '/').startsWith(`screenshots/${project.path}`));
    }
}
exports.DefaultErrorCollector = DefaultErrorCollector;
class ErrorReport {
    constructor(project) {
        this.project = project;
        this.errors = [];
        this.suites = new Map();
        this.registerSuite = (suite) => {
            const registered = this.suites.get(suite.title);
            if (registered)
                suite.specs.forEach(registered.registerSpec);
            else
                this.suites.set(suite.title, suite);
            this.errors.push(...suite.errors);
        };
    }
}
exports.ErrorReport = ErrorReport;
class Suite {
    constructor(title) {
        this.title = title;
        this.errors = [];
        this.specs = new Map();
        this.registerSpec = (spec) => {
            const registered = this.specs.get(spec.title);
            if (registered)
                spec.errors.forEach(registered.registerError);
            else
                this.specs.set(spec.title, spec);
            this.errors.push(...spec.errors);
        };
    }
}
class Spec {
    constructor(title) {
        this.title = title;
        this.errors = [];
        this.registerError = (error) => {
            this.errors.push(error);
        };
    }
}
class SpecError {
    constructor(details, screenshots) {
        this.details = details;
        this.screenshots = screenshots;
    }
}
