import { Octokit } from '@octokit/rest';
import { Endpoints } from '@octokit/types';

export class Octo {
  public readonly kit: Octokit;

  constructor(auth: string, userAgent: string) {
    this.kit = new Octokit({ auth, userAgent });
  }

  async createIssue({ owner, repo, title, body, labels, assignees }: Issue) {
    const { data } = await this.kit.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
      assignees,
    });

    return data.number;
  }

  async createPullRequest({ owner, repo, title, head, base, body }: Omit<Pull, 'maintainer_can_modify'>) {
    const { data } = await this.kit.pulls.create({
      owner,
      repo,
      title,
      head,
      base,
      body,
      maintainer_can_modify: true,
    });

    return data.html_url;
  }
}

type Issue = Endpoints['POST /repos/:owner/:repo/issues']['parameters'];
type Pull = Endpoints['POST /repos/:owner/:repo/pulls']['parameters'];
