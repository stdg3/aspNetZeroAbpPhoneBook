import config from './config';
import * as Utils from './utils';

describe('DYNAMICPROPERTIES', () => {
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
        const DYNAMICPROPERTIES_CRUD_LIST = 'dynamicProperties.crud.010-list';
        const DYNAMICPROPERTIES_CRUD_NEW_MODAL = 'dynamicProperties.crud.020-new-modal';
        const DYNAMICPROPERTIES_CRUD_NEW_SAVE = 'dynamicProperties.crud.050-new-save';
        const DYNAMICPROPERTIES_CRUD_ACTIONS = 'dynamicProperties.crud.070-actions';
        const DYNAMICPROPERTIES_CRUD_EDIT_MODAL = 'dynamicProperties.crud.080-edit-modal';
        const DYNAMICPROPERTIES_CRUD_EDIT_SAVE = 'dynamicProperties.crud.090-edit-save';
        const DYNAMICPROPERTIES_CRUD_DELETE_WARNING = 'dynamicProperties.crud.100-delete-warning';
        const DYNAMICPROPERTIES_CRUD_DELETE_CANCEL = 'dynamicProperties.crud.110-delete-cancel';
        const DYNAMICPROPERTIES_CRUD_DELETE_CONFIRM = 'dynamicProperties.crud.120-delete-confirm';

        /* Step 1 */
        it('should render the initial list', async () => {
            await Utils.clickMenu('Administration', 'Dynamic Properties');
            await Utils.waitForTableContent();

            const shot = await Utils.screenshot.test(DYNAMICPROPERTIES_CRUD_LIST);
            expect(shot).toHaveNoChanges();
        });

        /* Step 2 */
        it('should display modal on click to "New" button', async () => {
            await Utils.clickByTextExact('Add New Dynamic Property');
            await Utils.waitForModal();

            const shot = await Utils.screenshot.test(DYNAMICPROPERTIES_CRUD_NEW_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 3 */
        it('should save record when "Save" button is clicked', async () => {
            await Utils.fillInputs({ 'input[name=propertyName]': 'test' });
            await Utils.fillInputs({ 'input[name=displayName]': 'testDisplay' });
            await Utils.selectOptionByValue('.modal.show select', 'SINGLE_LINE_STRING');

            await Utils.saveForm();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(DYNAMICPROPERTIES_CRUD_NEW_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 4 */
        it('should display actions on click to "Actions" button', async () => {
            await Utils.openActionsDropdown(1);
            await Utils.waitForDropdownMenu();

            const shot = await Utils.screenshot.test(DYNAMICPROPERTIES_CRUD_ACTIONS);
            expect(shot).toHaveNoChanges();
        });

        /* Step 5 */
        it('should display modal on click to "Edit" button', async () => {
            await Utils.triggerDropdownAction('Edit');
            await Utils.waitForResponse('CreateOrEditModal');
            await Utils.waitForModal();

            const shot = await Utils.screenshot.test(DYNAMICPROPERTIES_CRUD_EDIT_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 6 */
        it('should save changes to record when "Save" button is clicked', async () => {
            await Utils.fillInputs({ 'input[name=propertyName]': 'changed_name', 'input[name=displayName]': 'changed_display_name' });
            await Utils.saveForm();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(DYNAMICPROPERTIES_CRUD_EDIT_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 7 */
        it('should display warning on click to "Delete" button', async () => {
            await Utils.openActionsDropdown(1);
            await Utils.waitForDropdownMenu();
            await Utils.triggerDropdownAction('Delete');
            await Utils.waitForConfirmationDialog();

            const shot = await Utils.screenshot.test(DYNAMICPROPERTIES_CRUD_DELETE_WARNING);
            expect(shot).toHaveNoChanges();
        });

        /* Step 8 */
        it('should not delete record on click to "Cancel" button', async () => {
            await Utils.cancelConfirmation();
            const shot = await Utils.screenshot.test(DYNAMICPROPERTIES_CRUD_DELETE_CANCEL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 9 */
        it('should delete record on click to "Yes" button', async () => {
            await Utils.openActionsDropdown(1);
            await Utils.waitForDropdownMenu();
            await Utils.triggerDropdownAction('Delete');
            await Utils.waitForConfirmationDialog();
            await Utils.confirmConfirmation();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(DYNAMICPROPERTIES_CRUD_DELETE_CONFIRM);
            expect(shot).toHaveNoChanges();
        });
    });
});