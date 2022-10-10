import config from './config';
import * as Utils from './utils';

describe('ORGANIZATIONUNIT', () => {
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
        const ORGANIZATIONUNIT_CRUD_LIST = 'organizationunit.crud.010-list';
        const ORGANIZATIONUNIT_CRUD_NEW_MODAL = 'organizationunit.crud.020-new-modal';
        const ORGANIZATIONUNIT_CRUD_VALIDATION_SHOW = 'organizationunit.crud.030-validation-show';
        const ORGANIZATIONUNIT_CRUD_VALIDATION_HIDE = 'organizationunit.crud.040-validation-hide';
        const ORGANIZATIONUNIT_CRUD_NEW_SAVE = 'organizationunit.crud.050-new-save';
        const ORGANIZATIONUNIT_CRUD_ALREADY_EXISTED = 'organizationunit.crud.060-already-existed';
        const ORGANIZATIONUNIT_CRUD_ACTIONS = 'organizationunit.crud.070-actions';
        const ORGANIZATIONUNIT_CRUD_EDIT_MODAL = 'organizationunit.crud.080-edit-modal';
        const ORGANIZATIONUNIT_CRUD_EDIT_SAVE = 'organizationunit.crud.090-edit-save';
        const ORGANIZATIONUNIT_CRUD_ADD_SUB_ORGANIZATION = 'organizationunit.crud.091-add-sub-organization';
        const ORGANIZATIONUNIT_CRUD_DELETE_WARNING = 'organizationunit.crud.100-delete-warning';
        const ORGANIZATIONUNIT_CRUD_DELETE_CANCEL = 'organizationunit.crud.110-delete-cancel';
        const ORGANIZATIONUNIT_CRUD_DELETE_CONFIRM = 'organizationunit.crud.120-delete-confirm';

        /* Step 1 */
        it('should render the initial list', async () => {
            await Utils.clickMenu('Administration', 'Organization Units');
            await Utils.wait(1000);

            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_LIST);
            expect(shot).toHaveNoChanges();
        });

        /* Step 2 */
        it('should display modal on click to "Add root unit" button', async () => {
            await Utils.clickByTextExact('Add root unit');
            await Utils.waitForModal();

            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_NEW_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 3 */
        it('should show error when form is saved before required inputs are filled', async () => {
            await triggerValidation();
            await Utils.waitForModal();
            await Utils.saveModal();

            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_VALIDATION_SHOW);
            expect(shot).toHaveNoChanges();
        });

        /* Step 4 */
        it('should hide error when form is properly filled', async () => {
            await fillInputsWithValidValues();
            await Utils.triggerValidation('#DisplayName');

            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_VALIDATION_HIDE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 5 */
        it('should save record when "Save" button is clicked', async () => {
            await Utils.waitForModal();
            await Utils.saveModal();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_NEW_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 6 */
        it('should give an error when trying to create an existing item', async () => {
            await Utils.clickByTextExact('Add root unit');
            await Utils.waitForModal();

            await fillInputsWithValidValues();
            await Utils.waitForModal();
            await Utils.saveModal();
            await Utils.wait(1000);

            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_ALREADY_EXISTED);
            expect(shot).toHaveNoChanges();
        });

        /* Step 7 */
        it('should display actions on click to "Actions" button', async () => {
            await Utils.confirmConfirmation();
            await Utils.clickButtonByText('Cancel');
            await openOUDropdown();

            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_ACTIONS);
            expect(shot).toHaveNoChanges();
        });

        /* Step 8 */
        it('should display modal on click to "Edit" button', async () => {
            await clickOUDropdown('Edit');

            await Utils.waitForModal();

            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_EDIT_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 9 */
        it('should save changes to record when "Save" button is clicked', async () => {
            await Utils.fillInputs({ '#DisplayName': 'changed_name' });
            await Utils.waitForModal();
            await Utils.saveModal();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_EDIT_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 10 */
        it('should add sub organization', async () => {
            await openOUDropdown();
            await clickOUDropdown('Add sub-unit');
            await Utils.fillInputs({ '#DisplayName': 'test-sub-unit' });
            await Utils.waitForModal();
            await Utils.saveModal();
            await Utils.wait(1000);

            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_ADD_SUB_ORGANIZATION);
            expect(shot).toHaveNoChanges();
        });

        /* Step 11 */
        it('should display warning on click to "Delete" button', async () => {
            await openOUDropdown();
            await clickOUDropdown('Delete');
            await Utils.waitForConfirmationDialog();

            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_DELETE_WARNING);
            expect(shot).toHaveNoChanges();
        });

        /* Step 12 */
        it('should not delete record on click to "Cancel" button', async () => {
            await Utils.cancelConfirmation();
            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_DELETE_CANCEL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 13 */
        it('should delete record on click to "Yes" button', async () => {
            await openOUDropdown();
            await clickOUDropdown('Delete');

            await Utils.waitForConfirmationDialog();
            await Utils.confirmConfirmation();
            await Utils.waitForResponse();

            await Utils.wait(1000);
            await openOUDropdown();
            await clickOUDropdown('Delete');
            await Utils.waitForConfirmationDialog();
            await Utils.confirmConfirmation();
            await Utils.waitForResponse();
            
            const shot = await Utils.screenshot.test(ORGANIZATIONUNIT_CRUD_DELETE_CONFIRM);
            expect(shot).toHaveNoChanges();
        });

        async function triggerValidation() {
            await fillInputsWithValidValues();
            await Utils.clearInputs('#DisplayName');
        }

        function fillInputsWithValidValues() {
            return Utils.fillInputs({
                '#DisplayName': 'test'
            });
        }

        async function openOUDropdown() {
            await page.click('ul.jstree-container-ul li', { button: 'right' });
            await page.waitForSelector('.jstree-contextmenu', { state: 'visible' });
        }

        function clickOUDropdown(text: string) {
            return page.click(`css=.jstree-contextmenu >> text=/.*${text}.*/`);
        }
    });
});