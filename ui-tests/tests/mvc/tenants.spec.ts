import config from './config';
import * as Utils from './utils';

describe('TENANTS', () => {
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
        const TENANTS_CRUD_LIST = 'tenants.crud.010-list';
        const TENANTS_CRUD_NEW_MODAL = 'tenants.crud.020-new-modal';
        const TENANTS_CRUD_VALIDATION_SHOW = 'tenants.crud.030-validation-show';
        const TENANTS_CRUD_VALIDATION_HIDE = 'tenants.crud.040-validation-hide';
        const TENANTS_CRUD_NEW_SAVE = 'tenants.crud.050-new-save';
        const TENANTS_CRUD_ALREADY_EXISTED = 'tenants.crud.060-already-existed';
        const TENANTS_CRUD_ACTIONS = 'tenants.crud.070-actions';
        const TENANTS_CRUD_EDIT_MODAL = 'tenants.crud.080-edit-modal';
        const TENANTS_CRUD_EDIT_SAVE = 'tenants.crud.090-edit-save';
        const TENANTS_CRUD_DELETE_WARNING = 'tenants.crud.100-delete-warning';
        const TENANTS_CRUD_DELETE_CANCEL = 'tenants.crud.110-delete-cancel';
        const TENANTS_CRUD_DELETE_CONFIRM = 'tenants.crud.120-delete-confirm';

        /* Step  */
        it('should render the initial list', async () => {
            await Utils.clickMenu('Tenants');
            await Utils.replaceWith('.card-body form', 'FORM_REPLACED_DUE_TO_DATES')
            await Utils.waitForTableContent();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(TENANTS_CRUD_LIST);
            expect(shot).toHaveNoChanges();
        });

        /* Step 2 */
        it('should display modal on click to "New" button', async () => {
            await Utils.clickByTextExact('Create new tenant');
            await Utils.waitForModal();

            const shot = await Utils.screenshot.test(TENANTS_CRUD_NEW_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 3 */
        it('should show error when form is saved before required inputs are filled', async () => {
            await Utils.clickWithQuerySelector('#CreateTenant_SetRandomPassword');
            await triggerValidation();

            const shot = await Utils.screenshot.test(TENANTS_CRUD_VALIDATION_SHOW);
            expect(shot).toHaveNoChanges();
        });

        /* Step 4 */
        it('should hide error when form is properly filled', async () => {
            await fillInputsWithValidValues();

            await Utils.triggerValidation('#TenancyName', '#Name', '#AdminEmailAddress', '#CreateTenant_AdminPassword', '#AdminPasswordRepeat');

            const shot = await Utils.screenshot.test(TENANTS_CRUD_VALIDATION_HIDE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 5 */
        it('should save record when "Save" button is clicked', async () => {
            await Utils.saveForm();
            await Utils.waitForResponse();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(TENANTS_CRUD_NEW_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 6 */
        it('should give an error when trying to create an existing item', async () => {
            await Utils.clickByTextExact('Create new tenant');
            await Utils.waitForModal();
            await Utils.clickWithQuerySelector('#CreateTenant_SetRandomPassword');
            await fillInputsWithValidValues();
            await page.waitForTimeout(5000);
            await Utils.saveForm();
            await Utils.waitForResponse();

            const shot = await Utils.screenshot.test(TENANTS_CRUD_ALREADY_EXISTED);
            expect(shot).toHaveNoChanges();
        });

        /* Step 7 */
        it('should display actions on click to "Actions" button', async () => {
            await Utils.confirmConfirmation();
            await page.waitForTimeout(5000);
            await clickWithJavascript("close-button");
            await Utils.openActionsDropdown(2);
            await Utils.waitForDropdownMenu();

            const shot = await Utils.screenshot.test(TENANTS_CRUD_ACTIONS);
            expect(shot).toHaveNoChanges();
        });

        // /* Step 8 */
        it('should display modal on click to "Edit" button', async () => {
            await Utils.triggerDropdownAction('Edit');
            await Utils.waitForResponse('EditModal');
            await Utils.waitForModal();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(TENANTS_CRUD_EDIT_MODAL);
            expect(shot).toHaveNoChanges();
        });

        /* Step 9 */
        it('should save changes to record when "Save" button is clicked', async () => {
            await Utils.fillInputs({ '#Name': 'changed_name' });
            await Utils.saveForm();
            await Utils.waitForResponse();
            await Utils.replaceLastColoumnOfTable();

            const shot = await Utils.screenshot.test(TENANTS_CRUD_EDIT_SAVE);
            expect(shot).toHaveNoChanges();
        });

        /* Step 10 */
        it('should display warning on click to "Delete" button', async () => {
            await Utils.openActionsDropdown(2);
            await Utils.waitForDropdownMenu();
            await Utils.triggerDropdownAction('Delete');
            await Utils.waitForConfirmationDialog();

            const shot = await Utils.screenshot.test(TENANTS_CRUD_DELETE_WARNING);
            expect(shot).toHaveNoChanges();
        });

        /* Step 11 */
        it('should not delete record on click to "Cancel" button', async () => {
            await Utils.cancelConfirmation();
            const shot = await Utils.screenshot.test(TENANTS_CRUD_DELETE_CANCEL);
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

            const shot = await Utils.screenshot.test(TENANTS_CRUD_DELETE_CONFIRM);
            expect(shot).toHaveNoChanges();
        });

        async function triggerValidation() {
            await fillInputsWithValidValues();
            await Utils.clearInputs('#TenancyName', '#Name', '#AdminEmailAddress', '#CreateTenant_AdminPassword', '#AdminPasswordRepeat');
        }

        function fillInputsWithValidValues() {
            return Utils.fillInputs({
                '#TenancyName': 'test',
                '#Name': 'test',
                '#AdminEmailAddress': 'test@test.com',
                '#CreateTenant_AdminPassword': '123qwe',
                '#AdminPasswordRepeat': '123qwe',
            });
        }

        function clickWithJavascript(className: string) {
            const content = `
            (function(){
                document.getElementsByClassName("${className}")[0].click();
            })()
            `;

            return page.addScriptTag({
                content,
                type: 'module',
            });
        }
    });
});