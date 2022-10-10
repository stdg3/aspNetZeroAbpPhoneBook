"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMergeInitiator = exports.MergeInitiator = void 0;
const octo_1 = require("./octo");
class MergeInitiator {
    constructor(github, { name, version }) {
        this.github = github;
        this.octo = new octo_1.Octo(github.token, `${name} v${version}`);
    }
}
exports.MergeInitiator = MergeInitiator;
class DefaultMergeInitiator extends MergeInitiator {
    init(branch, issue) {
        const merge = new Merge(this.github, branch, issue);
        return this.octo.createPullRequest(merge);
    }
}
exports.DefaultMergeInitiator = DefaultMergeInitiator;
class Merge {
    constructor({ repo, defaultBranch }, branch, issue) {
        [this.owner, this.repo] = repo.split('/').splice(-2);
        this.head = branch.name;
        this.base = defaultBranch;
        this.title = `Updates via ${branch.name}`;
        this.body = `Fixes ${issue.owner}/${issue.repo}#${issue.number}`;
    }
}
