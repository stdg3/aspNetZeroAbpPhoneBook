import config from './config';
import * as Utils from './utils';

describe('LANGUAGES', () => {
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
        const LANGUAGES_PAGE_RENDER = 'languages.code-flow.page-render';

        /* Step 1 */
        it('should render the page', async () => {
            await Utils.clickMenu('Administration', 'Languages');
            await Utils.waitForTableContent();
            await Utils.replaceLastColoumnOfTable();
            
            const shot = await Utils.screenshot.test(LANGUAGES_PAGE_RENDER);
            expect(shot).toHaveNoChanges();
        });
    });
});