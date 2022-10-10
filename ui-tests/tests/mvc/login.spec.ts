import config from './config';
import * as Utils from './utils';

const LOGIN_CODE_FLOW_PASSWORD_INVALID = 'login.code-flow.password-invalid';
const LOGIN_CODE_FLOW_PASSWORD_VALID = 'login.code-flow.password-valid';

describe('LOGIN', () => {
  afterAll(async () => {
    await page.close();
  });

  afterEach(async () => {
    await page.waitForTimeout(1000);
  });

  describe('CODE FLOW', () => {
    const login = new Utils.Login(config);

    it('should not login when password is invalid', async () => {
      await login.attemptAuth({ pass: 'iNVaLiD' });
      await page.waitForSelector('.swal-modal', { state: 'visible' });
      await page.waitForTimeout(5000);
      
      const shot = await Utils.screenshot.test(LOGIN_CODE_FLOW_PASSWORD_INVALID);
      
      expect(shot).toHaveNoChanges();
    });
    
    it('should login when password is valid', async () => {
      await login.succeedAuth();
      await page.waitForTimeout(5000);
      await Utils.replaceFooterWith();
      await Utils.replaceWith('#kt_wrapper','dashboard-replaced');
      await Utils.wait(5000);

      const shot = await Utils.screenshot.test(LOGIN_CODE_FLOW_PASSWORD_VALID);
      expect(shot).toHaveNoChanges();
    });
  });
});
