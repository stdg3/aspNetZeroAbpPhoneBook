import config from './config';
import * as Utils from './utils';

describe('USERS', () => {
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
        const USERS_CRUD_LIST = 'users.crud.010-list';
        const USERS_CRUD_NEW_MODAL = 'users.crud.020-new-modal';
        const USERS_CRUD_VALIDATION_SHOW = 'users.crud.030-validation-show';
        const USERS_CRUD_VALIDATION_HIDE = 'users.crud.040-validation-hide';
        const USERS_CRUD_NEW_SAVE = 'users.crud.050-new-save';
        const USERS_CRUD_ALREADY_EXISTED = 'users.crud.060-already-existed';
        const USERS_CRUD_ACTIONS = 'users.crud.070-actions';
        const USERS_CRUD_EDIT_MODAL = 'users.crud.080-edit-modal';
        const USERS_CRUD_EDIT_SAVE = 'users.crud.090-edit-save';
        const USERS_CRUD_DELETE_WARNING = 'users.crud.100-delete-warning';
        const USERS_CRUD_DELETE_CANCEL = 'users.crud.110-delete-cancel';
        const USERS_CRUD_DELETE_CONFIRM = 'users.crud.120-delete-confirm';

        /* Step 1 */
        it('should render the initial list', async () => {
            await Utils.clickMenu('Administration', 'Users');
            await Utils.waitForTableContent();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(USERS_CRUD_LIST);
            expect(shot).toHaveNoChanges();
        });

        /* Step 2 */
        it('should display modal on click to "New" button', async () => {
            await Utils.clickByTextExact('Create new user');
            await Utils.waitForModal();

            const shot = await Utils.screenshot.test(USERS_CRUD_NEW_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 3 */
        it('should show error when form is saved before required inputs are filled', async () => {
            await triggerValidation();

            const shot = await Utils.screenshot.test(USERS_CRUD_VALIDATION_SHOW);
            expect(shot).toHaveNoChanges();
        });

        /* Step 4 */
        it('should hide error when form is properly filled', async () => {
            await fillInputsWithValidValues();
            await Utils.triggerValidation('#Name', '#Surname', '#EmailAddress', '#UserName');

            const shot = await Utils.screenshot.test(USERS_CRUD_VALIDATION_HIDE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 5 */
        it('should save record when "Save" button is clicked', async () => {
            await Utils.saveModal();
            await Utils.waitForResponse();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(USERS_CRUD_NEW_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 6 */
        it('should give an error when trying to create an existing item', async () => {
            await Utils.clickByTextExact('Create new user');
            await Utils.waitForModal();
            await fillInputsWithValidValues();
            await Utils.wait(1000);
            await Utils.saveModal();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(USERS_CRUD_ALREADY_EXISTED);
            expect(shot).toHaveNoChanges();
        });

        /* Step 7 */
        it('should display actions on click to "Actions" button', async () => {
            await Utils.confirmConfirmation();
            await Utils.clickButtonByText('Cancel');
            await Utils.openActionsDropdown(2);
            await Utils.waitForDropdownMenu('#UsersTable');

            const shot = await Utils.screenshot.test(USERS_CRUD_ACTIONS);
            expect(shot).toHaveNoChanges();
        });

        /* Step 8 */
        it('should display modal on click to "Edit" button', async () => {
            await Utils.triggerDropdownAction('Edit');
            await Utils.waitForResponse('CreateOrEditModal');
            await Utils.waitForModal();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(USERS_CRUD_EDIT_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 9 */
        it('should save changes to record when "Save" button is clicked', async () => {
            await Utils.fillInputs({ '#Name': 'changed_name' });
            await Utils.saveModal();
            await Utils.waitForResponse();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(USERS_CRUD_EDIT_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 10 */
        it('should display warning on click to "Delete" button', async () => {
            await Utils.openActionsDropdown(2);
            await Utils.waitForDropdownMenu('#UsersTable');
            await Utils.triggerDropdownAction('Delete');
            await Utils.waitForConfirmationDialog();

            const shot = await Utils.screenshot.test(USERS_CRUD_DELETE_WARNING);
            expect(shot).toHaveNoChanges();
        });

        /* Step 11 */
        it('should not delete record on click to "Cancel" button', async () => {
            await Utils.cancelConfirmation();
            const shot = await Utils.screenshot.test(USERS_CRUD_DELETE_CANCEL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 12 */
        it('should delete record on click to "Yes" button', async () => {
            await Utils.openActionsDropdown(2);
            await Utils.waitForDropdownMenu('#UsersTable');
            await Utils.triggerDropdownAction('Delete');
            await Utils.waitForConfirmationDialog();
            await Utils.confirmConfirmation();
            await Utils.waitForResponse();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(USERS_CRUD_DELETE_CONFIRM);
            expect(shot).toHaveNoChanges();
        });

        async function triggerValidation() {
            await fillInputsWithValidValues();
            await Utils.clearInputs('#Name', '#Surname', '#EmailAddress', '#UserName');
        }

        function fillInputsWithValidValues() {
            return Utils.fillInputs({
                '#Name': 'test',
                '#Surname': 'test',
                '#EmailAddress': 'test@h.c',
                '#UserName': 'test',
            });
        }
    });
});