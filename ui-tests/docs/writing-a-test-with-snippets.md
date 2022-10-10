# Writing CRUD Tests with Snippets

There are some snippets within this repo to help you along when writing tests. You can check them out within the [.vscode](/.vscode) folder.

Create a test file that ends with `.spec.ts`. E.g: `tenants.spec.ts`. 
**Note:** The filename before `.spec.ts` is important and will be used within the snippets. You can use the dash `-` within the filename.

Let's write a sample test for the `Tenants` page. 

Firstly, we create a file under the path `tests/mvc/tenants.spec.ts` 

## `g-test-suite`

Then, run our first command which is `g-test-suite`

This command will create a test suite for us within which we will write our tests. 

**Note:** All of the available commands start with `g-`. You can type `g-` and VSCode should show all of the available snippets or you can hit `ctrl + space` (For Windows) or `cmd + space` (For Mac).

![g-test-suite](./images/g-test-suite.gif)

**Note:** After using a snippet, when you hit the `Tab` button, VSCode will move the cursor to the next location where it should be. Some of the snippets require writing code (e.g. passing some inputs to some functions) in different places. So, it is a good idea to always hit the `Tab` button after running a command.

## `g-crud-step01-suite`

Let's create a CRUD suite within our `TENANTS` suite. 

![g-crud-step01](./images/g-crud-step01.gif)

This snippet creates a *CRUD* suite. There are some constant values which will be used as the names of the screenshots within our tests. Also, the generated code is broken on purpose. It requires you to type in which menu items will be clicked in order. `Administration` is added as the first click because that most of the CRUD pages exist within `Administration`. You may remove it as you see fit. In this example, we need to click on the `Administration`, `Saas`, `Tenant` in order.

**Note:** `clickMenu` works on tablet and mobile resolutions as well. You do not need to write any extra code to click on the hamburger icon on mobile/tablet devices. 

**Result:**

![tenants.crud.010-list.desktop.png](./images/tenants.crud.010-list.desktop.png)

## `g-crud-step02-suite`

![g-crud-step02](./images/g-crud-step02.gif)

This snippet expects you to type in the name of the button that opens the modal. In this case, it is `New tenant`. After that, it waits for the modal to open and take a screenshot (also test it). 

**Result:**

![tenants.crud.020-new-modal.desktop.png](./images/tenants.crud.020-new-modal.desktop.png)

## `g-crud-step03-suite`

This snippet triggers validation on the form without filling any of the required inputs. 

![g-crud-step03](./images/g-crud-step03.gif)

**Result:**

![tenants.crud.030-validation-show.desktop.png](./images/tenants.crud.030-validation-show.desktop.png)

## `g-crud-step04-suite`

This snippet expects you to pass a dictionary to the `fillInputs` function. The keys are the CSS selector of the inputs. You may pass as many keys as you need. Also, you need to trigger validation for those inputs. After completing `fillInputs`, if you hit the `Tab` button, the cursor will move to the `triggerValidation` function. You need to pass the same selectors from the previous function as strings separated by comma. (a.k.a [rest parameters](https://www.typescriptlang.org/docs/handbook/functions.html#rest-parameters))

**Note:** You may also have additional fields that are not plain inputs such as dropdowns, checkboxes, etc. There are some helper functions for those as well. 
For example, it is not shown in the gif but the following code is used for choosing an item from the `Edition` dropdown

```Typescript
await Utils.selectOptionByLabel('#Tenant_EditionId', 'Standard');
```

![g-crud-step04](./images/g-crud-step04.gif)

**Result:**

![tenants.crud.040-validation-hide.desktop.png](./images/tenants.crud.040-validation-hide.desktop.png)

## `g-crud-step05-suite`

This snippet saves the form and creates a new tenant.

![g-crud-step05](./images/g-crud-step05.gif)

**Result:**

![tenants.crud.050-new-save.desktop.png](./images/tenants.crud.050-new-save.desktop.png)

## `g-crud-step06-suite`

This snippet tries to save an already existed item (which was created in the last step.)

![g-crud-step06](./images/g-crud-step06.gif)

**Result:**

![tenants.crud.060-already-existed.desktop.png](./images/tenants.crud.060-already-existed.desktop.png)

## `g-crud-step07-suite`

This snippet opens the `Actions` dropdown.

![g-crud-step07](./images/g-crud-step07.gif)

**Result:**

![tenants.crud.070-actions.desktop.png](./images/tenants.crud.070-actions.desktop.png)

## `g-crud-step08-suite`

This snippet chooses the `Edit` action and opens up the edit modal.

![g-crud-step08](./images/g-crud-step08.gif)

**Result:**

![tenants.crud.080-edit-modal.desktop.png](./images/tenants.crud.080-edit-modal.desktop.png)

## `g-crud-step09-suite`

This snippet edits the tenant's name and saves it.

![g-crud-step09](./images/g-crud-step09.gif)

**Result:**

![tenants.crud.090-edit-save.desktop.png](./images/tenants.crud.090-edit-save.desktop.png)

## `g-crud-step10-suite`

This snippet chooses the `Delete` action and triggers the warning shown below.

![g-crud-step10](./images/g-crud-step10.gif)

**Result:**

![tenants.crud.100-delete-warning.desktop.png](./images/tenants.crud.100-delete-warning.desktop.png)

## `g-crud-step11-suite`
![g-crud-step11](./images/g-crud-step11.gif)

**Result:**

This snippet cancels the `Delete` action triggered by the previous step.

![tenants.crud.110-delete-cancel.desktop.png](./images/tenants.crud.110-delete-cancel.desktop.png)

## `g-crud-step12-suite`

This snippet triggers the `Delete` action and confirms the warning. In the end, we expect the screen to go back to its initial state.

![g-crud-step12](./images/g-crud-step12.gif)

**Result:**

![tenants.crud.120-delete-confirm.desktop.png](./images/tenants.crud.120-delete-confirm.desktop.png)
