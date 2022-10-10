import { disableTransitions } from '../../animations';
import * as selectorBase from '../selectors'
import * as wait from '../wait'

export async function triggerDropdownAction(actionText: string) {
  await page.click(`css=.show >> text=/.*${actionText}.*/`);
}

export function confirmConfirmation() {
  return page.click('.swal-button--confirm');
}

export function cancelConfirmation() {
  return page.click('.swal-button--cancel');
}

export async function clickMenu(...menuItems: string[]) {
  const { width } = page.viewportSize() as { width: number };
  // mobile or tablet
  if (width < 992) {
    await page.click('css=button#kt_aside_mobile_toggle');
  }
  await disableTransitions();

  const menuClicks: Promise<void>[] = [];

  for (let i = 0; i < menuItems.length; i++) {
    const menuItem = menuItems[i];
    menuClicks.push(wait.wait(1000));
    menuClicks.push(page.click(`css=.menu-title >> text="${menuItem}"`));
  }

  await Promise.all([page.waitForNavigation(), menuClicks]);

  await disableTransitions();
  await selectorBase.replaceFooterWith();
}