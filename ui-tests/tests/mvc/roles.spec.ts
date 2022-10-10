import config from './config';
import * as Utils from './utils';

describe('ROLES', () => {
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
        const ROLES_CRUD_LIST = 'roles.crud.010-list';
        const ROLES_CRUD_NEW_MODAL = 'roles.crud.020-new-modal';
        const ROLES_CRUD_NEW_SAVE = 'roles.crud.050-new-save';
        const ROLES_CRUD_ALREADY_EXISTED = 'roles.crud.060-already-existed';
        const ROLES_CRUD_ACTIONS = 'roles.crud.070-actions';
        const ROLES_CRUD_EDIT_MODAL = 'roles.crud.080-edit-modal';
        const ROLES_CRUD_EDIT_SAVE = 'roles.crud.090-edit-save';
        const ROLES_CRUD_DELETE_WARNING = 'roles.crud.100-delete-warning';
        const ROLES_CRUD_DELETE_CANCEL = 'roles.crud.110-delete-cancel';
        const ROLES_CRUD_DELETE_CONFIRM = 'roles.crud.120-delete-confirm';

        /* Step  */
        it('should render the initial list', async () => {
            await Utils.clickMenu('Administration', 'Roles');
            await Utils.waitForTableContent();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(ROLES_CRUD_LIST);
            expect(shot).toHaveNoChanges();
        });

        /* Step 2 */
        it('should display modal on click to "New" button', async () => {
            await Utils.clickByTextExact('Create new role');
            await Utils.waitForModal();

            const shot = await Utils.screenshot.test(ROLES_CRUD_NEW_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 5 */
        it('should save record when "Save" button is clicked', async () => {
            await fillInputsWithValidValues();
            await Utils.saveForm();
            await Utils.waitForResponse();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(ROLES_CRUD_NEW_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 6 */
        it('should give an error when trying to create an existing item', async () => {
            await page.waitForTimeout(1000);
            await Utils.clickByTextExact('Create new role');
            await Utils.waitForModal();
            await fillInputsWithValidValues();
            await page.waitForTimeout(5000);
            await Utils.saveForm();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(ROLES_CRUD_ALREADY_EXISTED);
            expect(shot).toHaveNoChanges();
        });

        // /* Step 7 */
        it('should display actions on click to "Actions" button', async () => {
            await Utils.confirmConfirmation();
            await page.waitForTimeout(500);
            await Utils.clickButtonByText('Cancel');
            await page.waitForTimeout(500);
            await Utils.openActionsDropdown(2);
            await Utils.waitForDropdownMenu();

            const shot = await Utils.screenshot.test(ROLES_CRUD_ACTIONS);
            expect(shot).toHaveNoChanges();
        });

        /* Step 8 */
        it('should display modal on click to "Edit" button', async () => {
            await Utils.triggerDropdownAction('Edit');
            await Utils.waitForResponse('CreateOrEditModal');
            await Utils.waitForModal();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(ROLES_CRUD_EDIT_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 9 */
        it('should save changes to record when "Save" button is clicked', async () => {
            await Utils.fillInputs({ '#RoleName': 'changed_name' });
            await Utils.saveForm();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(ROLES_CRUD_EDIT_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 10 */
        it('should display warning on click to "Delete" button', async () => {
            await Utils.openActionsDropdown(2);
            await Utils.waitForDropdownMenu();
            await Utils.triggerDropdownAction('Delete');
            await Utils.waitForConfirmationDialog();

            const shot = await Utils.screenshot.test(ROLES_CRUD_DELETE_WARNING);
            expect(shot).toHaveNoChanges();
        });

        /* Step 11 */
        it('should not delete record on click to "Cancel" button', async () => {
            await Utils.cancelConfirmation();
            const shot = await Utils.screenshot.test(ROLES_CRUD_DELETE_CANCEL);
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
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(ROLES_CRUD_DELETE_CONFIRM);
            expect(shot).toHaveNoChanges();
        });

        function fillInputsWithValidValues() {
            return Utils.fillInputs({
                '#RoleName': 'test'
            });
        }
    });
});