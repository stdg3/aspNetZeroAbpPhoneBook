import fse from 'fs-extra';
import _ from 'lodash';
import simpleGit from 'simple-git';
import { ErrorReport } from './errors';

const git = simpleGit();

export abstract class BranchAssigner {
  protected readonly datestamp = createDateTimeStamp();

  constructor(protected github: Env.GitHub) {}

  abstract assign(errorReport: ErrorReport): Promise<Branch>;
}

export class DefaultBranchAssigner extends BranchAssigner {
  async assign(errorReport: ErrorReport) {
    await this.checkoutDefaultBranch();
    const name = await this.createBranch(errorReport);
    const [commit] = await this.commitChanges(errorReport);
    await this.pushCommits(name);
    await this.checkoutDefaultBranch();
    return { name, commit };
  }

  private async checkoutDefaultBranch() {
    await git.checkout(this.github.defaultBranch);
  }

  private async createBranch(errorReport: ErrorReport) {
    const branchName = `${_.kebabCase(errorReport.project.name)}/${this.datestamp}`;
    await git.checkoutLocalBranch(branchName);
    return branchName;
  }

  private async commitChanges(errorReport: ErrorReport) {
    const { approved, diffs } = this.resolveApprovedAndDiffs(errorReport);
    await git.add([...approved, ...diffs]);
    const commits = new Array<string>(2);
    await git.commit('Add diffs and new screenshots [auto]');
    commits[0] = await getLastCommitHash();
    if (!diffs.length) return commits;

    await Promise.all(diffs.map(diff => fse.remove(diff)));
    await git.add(diffs);
    await git.commit('Remove diffs [auto]');
    commits[1] = await getLastCommitHash();
    return commits;
  }

  // eslint-disable-next-line class-methods-use-this
  private resolveApprovedAndDiffs({ errors }: ErrorReport) {
    const approved = errors.map(({ screenshots }) => screenshots.approved);
    const diffs = errors.reduce((acc: string[], { screenshots }) => {
      if (screenshots.approved === screenshots.diff) return acc;
      acc.push(screenshots.diff);
      return acc;
    }, []);
    return { approved, diffs };
  }

  private async pushCommits(branchName: string) {
    await git.push(this.github.remoteName, branchName);
  }
}

async function getLastCommitHash() {
  return (await git.log(['-p']))?.latest?.hash??"";
}

function createDateTimeStamp() {
  const date = new Date();

  const year = String(date.getFullYear()).substr(-2);
  const month = `0${date.getMonth()}`.substr(-2);
  const day = `0${date.getDate()}`.substr(-2);
  const hours = `0${date.getHours()}`.substr(-2);
  const minutes = `0${date.getMinutes()}`.substr(-2);

  return `${year}-${month}-${day}-${hours + minutes}`;
}

export interface Branch {
  name: string;
  commit: string;
}
