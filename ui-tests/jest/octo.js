"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Octo = void 0;
const rest_1 = require("@octokit/rest");
class Octo {
    constructor(auth, userAgent) {
        this.kit = new rest_1.Octokit({ auth, userAgent });
    }
    async createIssue({ owner, repo, title, body, labels, assignees }) {
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
    async createPullRequest({ owner, repo, title, head, base, body }) {
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
exports.Octo = Octo;
