import { disableTransitions } from '../../animations';
import * as selectorBase from '../selectors'

export async function replaceCellsWithinTable(...columnIndexesToReplace: number[]) {
  const content = `
  (function(){
    document.querySelectorAll('datatable-body-row').forEach(item => {
      [${columnIndexesToReplace}].forEach(columnIndex => {
        item.querySelectorAll('datatable-body-cell')[columnIndex].innerHTML = 'REPLACED'
      })
      })
  })()
  `;

  return page.addScriptTag({
    content,
    type: 'module',
  });
}

export async function hideTableRowsExcept(count = 1) {
  const content = `
  (function(){
    const rows = Array.from(document.querySelectorAll('datatable-row-wrapper'));
    rows.slice(${count}, rows.length).forEach(row => {
      row.parentElement.removeChild(row);
    })

    document.querySelector('datatable-footer').style.display = 'none'
  })()
  `;

  return page.addScriptTag({
    content,
    type: 'module',
  });
}

export async function triggerDropdownAction(actionText: string) {
  await page.click(`css=.dropdown-menu.show >> text=/.*${actionText}.*/`);
}

export function confirmConfirmation() {
  return page.click('.swal2-confirm');
}

export function cancelConfirmation() {
  return page.click('.swal2-cancel');
}


export async function clickMenu(...menuItems: string[]) {
  const { width } = page.viewportSize() as { width: number };
  // mobile or tablet
  if (width < 992) {
    await page.click('css=button#kt_aside_mobile_toggle');
  }
  await disableTransitions();
  const menuClicks = menuItems.map(menuItem => page.click(`css=.menu-title  >> text="${menuItem}"`));
  await Promise.all([page.waitForNavigation(), menuClicks]);
  await disableTransitions();
  await selectorBase.replaceFooterWith();
}