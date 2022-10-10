import config from './config';
import * as Utils from './utils';

describe('EDITIONS', () => {
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
        const EDITIONS_CRUD_LIST = 'editions.crud.010-list';
        const EDITIONS_CRUD_NEW_MODAL = 'editions.crud.020-new-modal';
        const EDITIONS_CRUD_VALIDATION_SHOW = 'editions.crud.030-validation-show';
        const EDITIONS_CRUD_VALIDATION_HIDE = 'editions.crud.040-validation-hide';
        const EDITIONS_CRUD_NEW_SAVE = 'editions.crud.050-new-save';
        const EDITIONS_CRUD_ACTIONS = 'editions.crud.070-actions';
        const EDITIONS_CRUD_EDIT_MODAL = 'editions.crud.080-edit-modal';
        const EDITIONS_CRUD_EDIT_SAVE = 'editions.crud.090-edit-save';
        const EDITIONS_CRUD_DELETE_WARNING = 'editions.crud.100-delete-warning';
        const EDITIONS_CRUD_DELETE_CANCEL = 'editions.crud.110-delete-cancel';
        const EDITIONS_CRUD_DELETE_CONFIRM = 'editions.crud.120-delete-confirm';

        /* Step  */
        it('should render the initial list', async () => {
            await Utils.clickMenu('Editions');
            await Utils.waitForTableContent();

            const shot = await Utils.screenshot.test(EDITIONS_CRUD_LIST);
            expect(shot).toHaveNoChanges();
        });

        /* Step 2 */
        it('should display modal on click to "New" button', async () => {
            await Utils.clickByTextExact('Create new edition');
            await Utils.waitForModal();

            const shot = await Utils.screenshot.test(EDITIONS_CRUD_NEW_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 3 */
        it('should show error when form is saved before required inputs are filled', async () => {
            await triggerValidation();

            const shot = await Utils.screenshot.test(EDITIONS_CRUD_VALIDATION_SHOW);
            expect(shot).toHaveNoChanges();
        });

        /* Step 4 */
        it('should hide error when form is properly filled', async () => {
            await fillInputsWithValidValues();

            await Utils.triggerValidation('#DisplayName', '#DailyPrice', '#WeeklyPrice', '#MonthlyPrice', '#AnnualPrice');

            const shot = await Utils.screenshot.test(EDITIONS_CRUD_VALIDATION_HIDE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 5 */
        it('should save record when "Save" button is clicked', async () => {
            await Utils.saveForm();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(EDITIONS_CRUD_NEW_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 7 */
        it('should display actions on click to "Actions" button', async () => {
            await Utils.openActionsDropdown(2);
            await Utils.waitForDropdownMenu();

            const shot = await Utils.screenshot.test(EDITIONS_CRUD_ACTIONS);
            expect(shot).toHaveNoChanges();
        });

        /* Step 8 */
        it('should display modal on click to "Edit" button', async () => {
            await Utils.triggerDropdownAction('Edit');
            await Utils.waitForResponse('EditModal');
            await Utils.waitForModal();

            const shot = await Utils.screenshot.test(EDITIONS_CRUD_EDIT_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 9 */
        it('should save changes to record when "Save" button is clicked', async () => {
            await Utils.fillInputs({ '#DisplayName': 'changed_name' });
            await Utils.saveForm();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(EDITIONS_CRUD_EDIT_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 10 */
        it('should display warning on click to "Delete" button', async () => {
            await Utils.openActionsDropdown(2);
            await Utils.waitForDropdownMenu();
            await Utils.triggerDropdownAction('Delete');
            await Utils.waitForConfirmationDialog();

            const shot = await Utils.screenshot.test(EDITIONS_CRUD_DELETE_WARNING);
            expect(shot).toHaveNoChanges();
        });

        /* Step 11 */
        it('should not delete record on click to "Cancel" button', async () => {
            await Utils.cancelConfirmation();
            const shot = await Utils.screenshot.test(EDITIONS_CRUD_DELETE_CANCEL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 12 */
        it('should delete record on click to "Yes" button', async () => {
            await Utils.openActionsDropdown(2);
            await Utils.waitForDropdownMenu();
            await Utils.triggerDropdownAction('Delete');
            await Utils.waitForConfirmationDialog();
            await Utils.confirmConfirmation();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(EDITIONS_CRUD_DELETE_CONFIRM);
            expect(shot).toHaveNoChanges();
        });

        async function triggerValidation() {
            await fillInputsWithValidValues();
            await Utils.clearInputs('#DisplayName', '#DailyPrice', '#WeeklyPrice', '#MonthlyPrice', '#AnnualPrice');
        }

        async function fillInputsWithValidValues() {
            await Utils.clickLabel('EditEdition_IsPaid');
            await Utils.wait(500);

            await Utils.fillInputs({
                '#DisplayName': 'test',
                '#DailyPrice': '1',
                '#WeeklyPrice': '2',
                '#MonthlyPrice': '3',
                '#AnnualPrice': '4',
            });
        }
    });
});