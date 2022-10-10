/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-useless-constructor */

import { Context, Reporter } from '@jest/reporters';
import { AggregatedResult } from '@jest/test-result';
import { Config } from '@jest/types';
import { Branch, BranchAssigner } from './branches';
import { ErrorCollector } from './errors';
import { IssueGenerator } from './issues';
import { MergeInitiator } from './merges';

export default class IssueReporter implements TestCompletionReporter {
  readonly errorCollector: ErrorCollector;

  readonly issueGenerator: IssueGenerator;

  readonly branchAssigner: BranchAssigner;

  readonly mergeInitiator: MergeInitiator;

  constructor(
    _config: Config.GlobalConfig,
    options: {
      branchAssigner: BranchAssigner;
      errorCollector: ErrorCollector;
      issueGenerator: IssueGenerator;
      mergeInitiator: MergeInitiator;
    },
  ) {
    this.errorCollector = options.errorCollector;
    this.issueGenerator = options.issueGenerator;
    this.branchAssigner = options.branchAssigner;
    this.mergeInitiator = options.mergeInitiator;
  }

  async onRunComplete(_: Set<Context>, results: AggregatedResult) {
    try {
      const errors = Array.from(this.errorCollector.collect(results).values());

      const branches: Branch[] = [];
      for (const e of errors) {
        // branches should be created in order
        // eslint-disable-next-line no-await-in-loop
        branches.push(await this.branchAssigner.assign(e));
      }

      const issues = await Promise.all(errors.map((e, i) => this.issueGenerator.generate(e, branches[i])));

      await Promise.all(branches.map((b, i) => this.mergeInitiator.init(b, issues[i])));
    } catch (err) {
      console.warn(err);
    }
  }
}

type TestCompletionReporter = Pick<Reporter, 'onRunComplete'>;
