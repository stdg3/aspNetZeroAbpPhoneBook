import { Response } from 'playwright';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function waitForConfirmationDialog(state: Visibility = 'visible') {
  // SWAL does not disappear
  await page.waitForSelector('.swal-modal', { state });
  await page.waitForTimeout(500);
}

export async function waitForDropdownMenu(tableCssSelector = '', state: Visibility = 'visible') {
  if (!tableCssSelector) {
    await page.waitForSelector('.dropdown-menu.show', { state });
    await page.waitForTimeout(500);
  } else {
    await page.waitForSelector(`css=${tableCssSelector} >> css=.dropdown-menu.show`, { state });
    await page.waitForTimeout(500);
  }
}

export async function waitForModal(state: Visibility = 'visible') {
  await page.waitForSelector('.modal', { state });
  await page.waitForTimeout(500);
}

export async function waitForResponse(apiName = '/api/') {
  const response = await page.waitForResponse((resp: Response) => resp.url().includes(apiName));
  await page.waitForTimeout(500);
  return response;
}

export async function waitForTableContent(tableCSSSelector = 'table', state: Visibility = 'visible') {
  await page.waitForSelector(`css=${tableCSSSelector} tbody >> xpath=//tr[1]`, { state });
  await page.waitForTimeout(500);
}


type Visibility = 'hidden' | 'visible';
