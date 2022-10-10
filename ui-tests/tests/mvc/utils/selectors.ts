import { disableTransitions, replaceFooterWith, Screenshot } from '../../shared';
import config from '../config';

export const screenshot = new Screenshot(config.path);

export async function goto(path: string) {
  await Promise.all([page.goto(config.urlApp + path), page.waitForNavigation()]);
  await replaceFooterWith();
  return disableTransitions();
}

export async function gotoLogin() {
  return goto('/Account/Login');
}

export async function gotoLogout() {
  return goto('/Account/Logout');
}
