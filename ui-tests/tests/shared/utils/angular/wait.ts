import { Response } from 'playwright';

export async function waitForModal(modalId: string, state: Visibility = 'visible') {
  await page.waitForSelector(`.modal[aria-labelledby=${modalId}].show`, { state });
  await page.waitForTimeout(1000);
}

export async function waitForResponse(apiName = '/api/') {
  const response = await page.waitForResponse((resp: Response) => resp.url().includes(apiName));
  await page.waitForTimeout(500);
  return response;
}

export async function waitForTableContent(tableSelector = '.primeng-datatable-container', state: Visibility = 'visible') {
  await Promise.race([
    page.waitForSelector(`${tableSelector} .p-datatable-scrollable-body .p-datatable-tbody:first-of-type`, { state }),
    page.waitForSelector(`${tableSelector} .p-datatable-tbody:first-of-type`, { state }),
    page.waitForSelector(`${tableSelector} .primeng-no-data`, { state }),
  ]);
  await page.waitForTimeout(500);
}

export async function waitForDropdownMenu(state: Visibility = 'visible') {
  await page.waitForSelector('.dropdown-menu.show', { state });
  await page.waitForTimeout(500);
}

export async function waitForConfirmationDialog(state: Visibility = 'visible') {
  await page.waitForSelector('.swal2-confirm', { state });
}

type Visibility = 'hidden' | 'visible';
