"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_sequencer_1 = __importDefault(require("@jest/test-sequencer"));
class LoginFirstAlphanumericSequencer extends test_sequencer_1.default {
    sort(tests) {
        return Array.from(tests).sort((a, b) => {
            const pathA = replaceLoginWithZero(a.path);
            const pathB = replaceLoginWithZero(b.path);
            return pathA > pathB ? 1 : -1;
        });
    }
}
exports.default = LoginFirstAlphanumericSequencer;
function replaceLoginWithZero(text) {
    return text.replace(/login([^\\/]*)\.spec/, '0$1.spec');
}
