"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultBranchAssigner = exports.BranchAssigner = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const lodash_1 = __importDefault(require("lodash"));
const simple_git_1 = __importDefault(require("simple-git"));
const git = simple_git_1.default();
class BranchAssigner {
    constructor(github) {
        this.github = github;
        this.datestamp = createDateTimeStamp();
    }
}
exports.BranchAssigner = BranchAssigner;
class DefaultBranchAssigner extends BranchAssigner {
    async assign(errorReport) {
        await this.checkoutDefaultBranch();
        const name = await this.createBranch(errorReport);
        const [commit] = await this.commitChanges(errorReport);
        await this.pushCommits(name);
        await this.checkoutDefaultBranch();
        return { name, commit };
    }
    async checkoutDefaultBranch() {
        await git.checkout(this.github.defaultBranch);
    }
    async createBranch(errorReport) {
        const branchName = `${lodash_1.default.kebabCase(errorReport.project.name)}/${this.datestamp}`;
        await git.checkoutLocalBranch(branchName);
        return branchName;
    }
    async commitChanges(errorReport) {
        const { approved, diffs } = this.resolveApprovedAndDiffs(errorReport);
        await git.add([...approved, ...diffs]);
        const commits = new Array(2);
        await git.commit('Add diffs and new screenshots [auto]');
        commits[0] = await getLastCommitHash();
        if (!diffs.length)
            return commits;
        await Promise.all(diffs.map(diff => fs_extra_1.default.remove(diff)));
        await git.add(diffs);
        await git.commit('Remove diffs [auto]');
        commits[1] = await getLastCommitHash();
        return commits;
    }
    // eslint-disable-next-line class-methods-use-this
    resolveApprovedAndDiffs({ errors }) {
        const approved = errors.map(({ screenshots }) => screenshots.approved);
        const diffs = errors.reduce((acc, { screenshots }) => {
            if (screenshots.approved === screenshots.diff)
                return acc;
            acc.push(screenshots.diff);
            return acc;
        }, []);
        return { approved, diffs };
    }
    async pushCommits(branchName) {
        await git.push(this.github.remoteName, branchName);
    }
}
exports.DefaultBranchAssigner = DefaultBranchAssigner;
async function getLastCommitHash() {
    var _a, _b, _c;
    return (_c = (_b = (_a = (await git.log(['-p']))) === null || _a === void 0 ? void 0 : _a.latest) === null || _b === void 0 ? void 0 : _b.hash) !== null && _c !== void 0 ? _c : "";
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
