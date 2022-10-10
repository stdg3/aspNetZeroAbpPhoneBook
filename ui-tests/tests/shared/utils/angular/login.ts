import { readTempFile, writeTempFile } from '../../temp';
import * as Utils from '../selectors';

export class Login {
  constructor(protected config: any) { }

  async login() {
    return this.succeedAuth();
  }

  async succeedAuth() {
    await this.attemptAuth();
    await page.waitForTimeout(1000);
  }

  async attemptAuth({ pass = this.config.auth.pass, user = this.config.auth.user, url = this.config.urlApp } = {}) {
    await page.goto(url);
    await page.waitForTimeout(500);

    await this.submitLoginForm(user, pass);
  }

  async submitLoginForm(user: string, pass: string) {
    await page.click('input[name="userNameOrEmailAddress"]');
    await page.fill('input[name="userNameOrEmailAddress"]', user);
    await page.press('input[name="password"]', 'Tab');
    await page.fill('input[name="password"]', pass);

    await Utils.clickSubmitButtonWithin(".login-form")
  }
}
