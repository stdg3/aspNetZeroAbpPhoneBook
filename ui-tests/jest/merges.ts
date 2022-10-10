import { Branch } from './branches';
import { Issue } from './issues';
import { Octo } from './octo';

export abstract class MergeInitiator {
  protected octo: Octo;

  constructor(protected github: Env.GitHub, { name, version }: Package) {
    this.octo = new Octo(github.token, `${name} v${version}`);
  }

  abstract init(branch: Branch, issue: Issue): Promise<string>;
}

export class DefaultMergeInitiator extends MergeInitiator {
  init(branch: Branch, issue: Issue) {
    const merge = new Merge(this.github, branch, issue);
    return this.octo.createPullRequest(merge);
  }
}

class Merge {
  readonly base: string;

  readonly body: string;

  readonly head: string;

  readonly owner: string;

  readonly repo: string;

  readonly title: string;

  constructor({ repo, defaultBranch }: Env.GitHub, branch: Branch, issue: Issue) {
    [this.owner, this.repo] = repo.split('/').splice(-2);
    this.head = branch.name;
    this.base = defaultBranch;
    this.title = `Updates via ${branch.name}`;
    this.body = `Fixes ${issue.owner}/${issue.repo}#${issue.number}`;
  }
}
