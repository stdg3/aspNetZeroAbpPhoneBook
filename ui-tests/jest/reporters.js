"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-useless-constructor */
Object.defineProperty(exports, "__esModule", { value: true });
class IssueReporter {
    constructor(_config, options) {
        this.errorCollector = options.errorCollector;
        this.issueGenerator = options.issueGenerator;
        this.branchAssigner = options.branchAssigner;
        this.mergeInitiator = options.mergeInitiator;
    }
    async onRunComplete(_, results) {
        try {
            const errors = Array.from(this.errorCollector.collect(results).values());
            const branches = [];
            for (const e of errors) {
                // branches should be created in order
                // eslint-disable-next-line no-await-in-loop
                branches.push(await this.branchAssigner.assign(e));
            }
            const issues = await Promise.all(errors.map((e, i) => this.issueGenerator.generate(e, branches[i])));
            await Promise.all(branches.map((b, i) => this.mergeInitiator.init(b, issues[i])));
        }
        catch (err) {
            console.warn(err);
        }
    }
}
exports.default = IssueReporter;
