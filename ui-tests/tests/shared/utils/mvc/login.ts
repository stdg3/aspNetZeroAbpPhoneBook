import * as forms from '../forms';

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
    await forms.fillInputs({
      'input[name="usernameOrEmailAddress"]': user,
      'input[name="password"]': pass
    });

    await page.click(`css=.login-form >> css=#kt_login_signin_submit`);
  }
}
