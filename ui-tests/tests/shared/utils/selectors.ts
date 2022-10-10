import { disableTransitions } from '../animations';

export function clickByText(text: string) {
  return page.click(`text=/.*${text}.*/`);
}

export function clickByTextExact(text: string) {
  return page.click(`text=/\s*${text}\s*/`);
}

export function clickByPlainTextExact(text: string) {
  return page.click(`text=${text}`);
}

export function clickButtonByText(text: string) {
  return page.click(`css=button >> text=/.*${text}.*/`);
}

export function clickLinkByText(text: string) {
  return page.click(`css=a >> text=/.*${text}.*/`);
}

export function clickSubmitButton() {
  return page.click('button[type="submit"]');
}

export function clickSubmitButtonWithin(selector: string) {
  return page.click(`css=${selector} >> css=button[type="submit"]`);
}

export function clickButtonByTextWithin(selector: string, text: string) {
  return page.click(`css=${selector} >> css=button >> text=/.*${text}.*/`);
}

export function clickLinkByTextWithin(selector: string, text: string) {
  return page.click(`css=${selector} >> css=a >> text=/.*${text}.*/`);
}

export async function cancelForm() {
  await page.click('css=button >> text=Cancel');
}

export async function saveForm() {
  await page.waitForSelector('text=/.*Save.*/');
  await page.click('text=/.*Save.*/');
}

export async function saveModal(selector = '.modal') {
  await clickButtonByTextWithin(selector, 'Save');
}

export async function saveFormWithin(selector: string) {
  await page.click(`css = ${selector} >> text=/.*Save.*/`);
}

export async function clickButtonAndWaitForNavigation(buttonText: string) {
  await Promise.all([clickButtonByText(buttonText), page.waitForNavigation()]);
}

export function generateUniqueNumber() {
  return Math.floor(Date.now() / 1000);
}

export async function clickLabel(id: string) {
  return page.click(`css = label[for="${id}"]`);
}

export async function reload() {
  await page.reload({
    waitUntil: 'domcontentloaded',
  });
  await disableTransitions();
  await replaceFooterWith();
}

export async function replaceFooterWith(placeholder = 'FOOTER-PLACEHOLDER') {
  return replaceWith('#kt_footer', placeholder);
}

export async function replaceWith(selector: string, innerHTML = 'REPLACED') {
  const content = `
  (function(){
    const item = document.querySelector('${selector}');
    if (item) {
      item.innerText = '${innerHTML}';
    }
  })()
  `;
  return page.addScriptTag({
    content,
    type: 'module',
  });
}

export async function clickWithQuerySelector(selector: string) {
  const content = `
  (function(){
    const item = document.querySelector('${selector}');
    if (item) {
      item.click();
    }
  })()
  `;
  return page.addScriptTag({
    content,
    type: 'module',
  });
}

export async function triggerValidation(firstSelector: string, ...selectors: string[]) {
  for (const selector of [firstSelector, ...selectors]) {
    /* eslint-disable no-await-in-loop */
    await page.press(selector, 'Tab');
    await page.focus(selector);
    /* eslint-enable no-await-in-loop */
  }
}

export async function openActionsDropdown(rowNumber = 1, tableCssSelector = '') {
  if (!tableCssSelector) {
    await page.click(`xpath=//tbody//tr[${rowNumber}] >> text=/.*Actions.*/`);
  } else {
    await page.click(`css=${tableCssSelector} >> xpath=//tbody//tr[${rowNumber}] >> text=/.*Actions.*/`);
  }
}

export async function replaceNthColoumnOfTable(coloumnNumber: number, placeholder = 'REPLACED') {
  const content = `
  (function(){
    var list = document.querySelectorAll("tr > td:nth-child(${coloumnNumber})");
    if (list && list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        list[i].innerText = '${placeholder}';
      }
    }
  })()
  `;
  return page.addScriptTag({
    content,
    type: 'module',
  });
}

export async function replaceLastColoumnOfTable(placeholder = 'REPLACED') {
  const content = `
  (function(){
    var list = document.querySelectorAll("tr > td:last-of-type");
    if (list && list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        list[i].innerText = '${placeholder}';
      }
    }
  })()
  `;
  return page.addScriptTag({
    content,
    type: 'module',
  });
}