import config from './config';
import * as Utils from './utils';

describe('VISUALSETTINGS', () => {
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
        const VISUALSETTING_PAGE_RENDER = 'visualsettings.code-flow.page-render';
        const VISUALSETTING_SET_DEFAULT_THEME = 'visualsettings.code-flow.theme-1';
        const VISUALSETTING_SET_THEME_2 = 'visualsettings.code-flow.theme-2';
        const VISUALSETTING_SET_THEME_3 = 'visualsettings.code-flow.theme-3';
        const VISUALSETTING_SET_THEME_4 = 'visualsettings.code-flow.theme-4';
        const VISUALSETTING_SET_THEME_5 = 'visualsettings.code-flow.theme-5';
        const VISUALSETTING_SET_THEME_6 = 'visualsettings.code-flow.theme-6';
        const VISUALSETTING_SET_THEME_7 = 'visualsettings.code-flow.theme-7';
        const VISUALSETTING_SET_THEME_8 = 'visualsettings.code-flow.theme-8';
        const VISUALSETTING_SET_THEME_9 = 'visualsettings.code-flow.theme-9';
        const VISUALSETTING_SET_THEME_10 = 'visualsettings.code-flow.theme-10';
        const VISUALSETTING_SET_THEME_11 = 'visualsettings.code-flow.theme-11';

        /* Step 1 */
        it('should render the page', async () => {
            await Utils.clickMenu('Administration', 'Visual Settings');

            const shot = await Utils.screenshot.test(VISUALSETTING_PAGE_RENDER);
            expect(shot).toHaveNoChanges();
        });

        /* Step 2 */
        it('should set defaut theme', async () => {
            await changeTheme('Default');

            const shot = await Utils.screenshot.test(VISUALSETTING_SET_DEFAULT_THEME);
            expect(shot).toHaveNoChanges();
        });

        /* Step 2 */
        it('should set theme 2', async () => {
            await changeTheme('Theme 2');

            const shot = await Utils.screenshot.test(VISUALSETTING_SET_THEME_2);
            expect(shot).toHaveNoChanges();
        });

        /* Step 4 */
        it('should set theme 3', async () => {
            await changeTheme('Theme 3');

            const shot = await Utils.screenshot.test(VISUALSETTING_SET_THEME_3);
            expect(shot).toHaveNoChanges();
        });

        /* Step 5 */
        it('should set theme 4', async () => {
            await changeTheme('Theme 4');

            const shot = await Utils.screenshot.test(VISUALSETTING_SET_THEME_4);
            expect(shot).toHaveNoChanges();
        });

        /* Step 6 */
        it('should set theme 5', async () => {
            await changeTheme('Theme 5');

            const shot = await Utils.screenshot.test(VISUALSETTING_SET_THEME_5);
            expect(shot).toHaveNoChanges();
        });

        /* Step 7 */
        it('should set theme 6', async () => {
            await changeTheme('Theme 6');

            const shot = await Utils.screenshot.test(VISUALSETTING_SET_THEME_6);
            expect(shot).toHaveNoChanges();
        });

        /* Step 8 */
        it('should set theme 7', async () => {
            await changeTheme('Theme 7');

            const shot = await Utils.screenshot.test(VISUALSETTING_SET_THEME_7);
            expect(shot).toHaveNoChanges();
        });

        /* Step 9 */
        it('should set theme 8', async () => {
            await changeTheme('Theme 8');

            const shot = await Utils.screenshot.test(VISUALSETTING_SET_THEME_8);
            expect(shot).toHaveNoChanges();
        });

        /* Step 10 */
        it('should set theme 9', async () => {
            await changeTheme('Theme 9');

            const shot = await Utils.screenshot.test(VISUALSETTING_SET_THEME_9);
            expect(shot).toHaveNoChanges();
        });

        /* Step 11 */
        it('should set theme 10', async () => {
            await changeTheme('Theme 10');

            const shot = await Utils.screenshot.test(VISUALSETTING_SET_THEME_10);
            expect(shot).toHaveNoChanges();
        });

        /* Step 12 */
        it('should set theme 11', async () => {
            await changeTheme('Theme 11')

            const shot = await Utils.screenshot.test(VISUALSETTING_SET_THEME_11);
            expect(shot).toHaveNoChanges();
            await changeTheme('Default');
        });

        async function changeTheme(theme: string) {
            await Utils.clickLinkByText(theme);
            await page.click('#SaveDefaultSettingsButton');
            await Utils.waitForResponse();
            await Utils.wait(2000);
            await Utils.replaceFooterWith();
        }
    });
});