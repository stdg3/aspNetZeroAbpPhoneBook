import config from './config';
import * as Utils from './utils';

describe('WEBHOOKSUBSCRIPTION', () => {
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

    describe('CRUD', () => {
        const WEBHOOKSUBSCRIPTION_CRUD_LIST = 'webhookSubscription.crud.010-list';
        const WEBHOOKSUBSCRIPTION_CRUD_NEW_MODAL = 'webhookSubscription.crud.020-new-modal';
        const WEBHOOKSUBSCRIPTION_CRUD_NEW_SAVE = 'webhookSubscription.crud.050-new-save';
        const WEBHOOKSUBSCRIPTION_CRUD_DETAIL = 'webhookSubscription.crud.070-detail';
        const WEBHOOKSUBSCRIPTION_CRUD_EDIT_MODAL = 'webhookSubscription.crud.080-edit-modal';
        const WEBHOOKSUBSCRIPTION_CRUD_EDIT_SAVE = 'webhookSubscription.crud.090-edit-save';
        const WEBHOOKSUBSCRIPTION_CRUD_DELETE_WARNING = 'webhookSubscription.crud.100-delete-warning';
        const WEBHOOKSUBSCRIPTION_CRUD_DELETE_CANCEL = 'webhookSubscription.crud.110-delete-cancel';
        const WEBHOOKSUBSCRIPTION_CRUD_DELETE_CONFIRM = 'webhookSubscription.crud.120-delete-confirm';

        /* Step 1 */
        it('should render the initial list', async () => {
            await Utils.clickMenu('Administration', 'Webhook Subscriptions');
            await Utils.waitForTableContent();

            const shot = await Utils.screenshot.test(WEBHOOKSUBSCRIPTION_CRUD_LIST);
            expect(shot).toHaveNoChanges();
        });

        /* Step 2 */
        it('should display modal on click to "New" button', async () => {
            await Utils.clickByTextExact('Add New Webhook Subscription');
            await Utils.waitForModal();

            const shot = await Utils.screenshot.test(WEBHOOKSUBSCRIPTION_CRUD_NEW_MODAL);
            expect(shot).toHaveNoChanges();
        });
     
        /* Step 5 */
        it('should save record when "Save" button is clicked', async () => {
            await fillInputsWithValidValues();
            await Utils.saveForm();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(WEBHOOKSUBSCRIPTION_CRUD_NEW_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 6 */
        it('should go details page', async () => {
            await Utils.clickButtonByTextWithin('#SubscriptionTable', 'Details');
            await Utils.waitForResponse();
            await Utils.wait(2000);

            const shot = await Utils.screenshot.test(WEBHOOKSUBSCRIPTION_CRUD_DETAIL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 7 */
        it('should display modal on click to "Edit" button', async () => {
            await clickDropdownBtn('Edit Webhook Subscription');

            await Utils.waitForResponse('EditModal');
            await Utils.wait(2000);

            const shot = await Utils.screenshot.test(WEBHOOKSUBSCRIPTION_CRUD_EDIT_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 8 */
        it('should save changes to record when "Save" button is clicked', async () => {
            await Utils.fillInputs({ '#webhookEndpointURL': 'https://www.changedurl.com/' });
            await Utils.saveForm();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(WEBHOOKSUBSCRIPTION_CRUD_EDIT_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 9 */
        it('should display warning on click to "Deactivate" button', async () => {
            await clickDropdownBtn('Deactivate');

            await Utils.waitForConfirmationDialog();

            const shot = await Utils.screenshot.test(WEBHOOKSUBSCRIPTION_CRUD_DELETE_WARNING);
            expect(shot).toHaveNoChanges();
        });

        /* Step 10 */
        it('should not disable record on click to "Cancel" button', async () => {
            await Utils.cancelConfirmation();
            const shot = await Utils.screenshot.test(WEBHOOKSUBSCRIPTION_CRUD_DELETE_CANCEL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 11 */
        it('should disable record on click to "Yes" button', async () => {
            await clickDropdownBtn('Deactivate');
            await Utils.waitForConfirmationDialog();
            await Utils.confirmConfirmation();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(WEBHOOKSUBSCRIPTION_CRUD_DELETE_CONFIRM);
            expect(shot).toHaveNoChanges();
        });

        async function fillInputsWithValidValues() {
            await Utils.fillInputs({
                '#webhookEndpointURL': 'https://www.google.com/',
                '.select2-search__field': 'App.TestWebhook',
            });

            await page.click('.select2-results__option');
        }

        async function clickDropdownBtn(text: string) {
            await page.click('abp-page-subheader .dropdown a[data-bs-toggle=dropdown]');
            await Utils.wait(500);
            await page.click(`css=abp-page-subheader .dropdown >> css=a >> text=/.*${text}.*/`)
        }
    });
});