"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Issue = exports.DefaultIssueGenerator = exports.IssueGenerator = void 0;
const ejs_1 = __importDefault(require("ejs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const octo_1 = require("./octo");
const diffReport = fs_extra_1.default.readFileSync(path_1.default.join(__dirname, './diff_report.md'), 'utf-8');
class IssueGenerator {
    constructor(github, { name, version }) {
        this.github = github;
        this.octo = new octo_1.Octo(github.token, `${name} v${version}`);
    }
}
exports.IssueGenerator = IssueGenerator;
class DefaultIssueGenerator extends IssueGenerator {
    constructor() {
        super(...arguments);
        this.template = diffReport;
    }
    async generate(errorReport, branch) {
        const issue = this.prepare(errorReport, branch);
        const issueNumber = await this.octo.createIssue(issue);
        issue.setNumber(issueNumber);
        return issue;
    }
    prepare(errorReport, branch) {
        const generatePath = createRawGitHubContentUrlGenerator(this.github.repo, branch.commit);
        const issue = new Issue(errorReport);
        issue.setBody(ejs_1.default.render(this.template, {
            ...errorReport,
            generatePath,
        }));
        return issue;
    }
}
exports.DefaultIssueGenerator = DefaultIssueGenerator;
class Issue {
    constructor({ project }) {
        this.body = '';
        this.assignees = project.owners;
        this.labels = project.labels;
        this.name = project.name;
        [this.owner, this.repo] = project.repo.split('/').splice(-2);
        this.title = `Diff Detected: ${project.name} project has changes`;
    }
    setBody(body) {
        this.body = body;
    }
    setNumber(issueNumber) {
        this.number = issueNumber;
    }
}
exports.Issue = Issue;
function createRawGitHubContentUrlGenerator(repo, commit) {
    const baseUrl = `https://github.com/${repo}/blob/${commit}`;
    return (filepath) => `${baseUrl}/${filepath.replace(/\\/gi, '/')}?raw=true`;
}
