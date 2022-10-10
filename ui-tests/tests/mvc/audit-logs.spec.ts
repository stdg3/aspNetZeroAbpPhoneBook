import config from './config';
import * as Utils from './utils';

describe('AUDITLOGS', () => {
    afterAll(async () => {
        await page.close();
    });

    afterEach(async () => {
        await Utils.wait(1000);
    });

    beforeAll(async () => {
        const login = new Utils.Login(config);
        await login.login();
    });

    describe('CODE FLOW', () => {
        const AUDITLOGS_PAGE_RENDER = 'auditlogs.code-flow.page-render';

        /* Step 1 */
        it('should render the page', async () => {
            await Utils.clickMenu('Administration', 'Audit logs');
            await Utils.waitForTableContent();
            await Utils.replaceWith('.tab-content', 'REPLACED_DUE_TO_DYNAMIC_DATA');

            const shot = await Utils.screenshot.test(AUDITLOGS_PAGE_RENDER);
            expect(shot).toHaveNoChanges();
        });
    });
});