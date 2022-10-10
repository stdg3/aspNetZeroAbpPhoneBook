/* eslint-disable class-methods-use-this */
import { Test } from '@jest/reporters';
import Sequencer from '@jest/test-sequencer';

export default class LoginFirstAlphanumericSequencer extends Sequencer {
  sort(tests: Array<Test>): Array<Test> {
    return Array.from(tests).sort((a, b) => {
      const pathA = replaceLoginWithZero(a.path);
      const pathB = replaceLoginWithZero(b.path);

      return pathA > pathB ? 1 : -1;
    });
  }
}

function replaceLoginWithZero(text: string) {
  return text.replace(/login([^\\/]*)\.spec/, '0$1.spec');
}
