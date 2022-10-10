"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchSuccess = exports.MatchError = void 0;
expect.extend({
    async toHaveNoChanges(params) {
        if (isError(params))
            return new MatchError(`Diff detected on ${params.paths.diff}`, params.paths);
        return new MatchSuccess(`Success: ${params.name} has no change.`);
    },
});
class MatchError {
    constructor(message, paths) {
        this.paths = paths;
        this.pass = false;
        this.message = () => message;
    }
}
exports.MatchError = MatchError;
class MatchSuccess {
    constructor(message) {
        this.pass = true;
        this.message = () => message;
    }
}
exports.MatchSuccess = MatchSuccess;
function isError(params) {
    return Boolean(params.diff);
}
