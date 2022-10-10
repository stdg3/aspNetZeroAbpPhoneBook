import ejs from 'ejs';
import fse from 'fs-extra';
import path from 'path';
import { Branch } from './branches';
import { ErrorReport } from './errors';
import { Octo } from './octo';

const diffReport = fse.readFileSync(path.join(__dirname, './diff_report.md'), 'utf-8');

export abstract class IssueGenerator {
  protected octo: Octo;

  constructor(protected github: Env.GitHub, { name, version }: Package) {
    this.octo = new Octo(github.token, `${name} v${version}`);
  }

  abstract generate(errorReport: ErrorReport, branch: Branch): Promise<Issue>;
}

export class DefaultIssueGenerator extends IssueGenerator {
  template = diffReport;

  async generate(errorReport: ErrorReport, branch: Branch) {
    const issue = this.prepare(errorReport, branch);
    const issueNumber = await this.octo.createIssue(issue);
    issue.setNumber(issueNumber);

    return issue;
  }

  private prepare(errorReport: ErrorReport, branch: Branch) {
    const generatePath = createRawGitHubContentUrlGenerator(this.github.repo, branch.commit);

    const issue = new Issue(errorReport);
    issue.setBody(
      ejs.render(this.template, {
        ...errorReport,
        generatePath,
      }),
    );

    return issue;
  }
}

export class Issue {
  readonly assignees: string[];

  readonly body: string = '';

  readonly labels: string[];

  readonly name: string;

  readonly number?: number;

  readonly owner: string;

  readonly repo: string;

  readonly title: string;

  constructor({ project }: ErrorReport) {
    this.assignees = project.owners;
    this.labels = project.labels;
    this.name = project.name;
    [this.owner, this.repo] = project.repo.split('/').splice(-2);
    this.title = `Diff Detected: ${project.name} project has changes`;
  }

  setBody(body: string) {
    (this as Writable<Issue>).body = body;
  }

  setNumber(issueNumber: number) {
    (this as Writable<Issue>).number = issueNumber;
  }
}

function createRawGitHubContentUrlGenerator(repo: string, commit: string) {
  const baseUrl = `https://github.com/${repo}/blob/${commit}`;
  return (filepath: string) => `${baseUrl}/${filepath.replace(/\\/gi, '/')}?raw=true`;
}

type Writable<T> = T extends Readonly<infer U> ? U : T;
