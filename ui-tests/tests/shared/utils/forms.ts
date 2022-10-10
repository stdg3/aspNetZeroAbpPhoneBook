import { wait } from './wait';

export async function fillInputs(inputs: { [key: string]: string }) {
  for (let key in inputs) {
    await page.fill(key, inputs[key]);
    await wait();
  }
}

export async function clearInputs(...selectors: string[]) {
  for (let key of selectors) {    
    await page.click(key);            
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.press(key, 'Backspace');

    await wait();
  }
}

export async function selectOptionByLabel(key: string, label: string) {
  await page.selectOption(key, { label });
}

export async function selectOptionByValue(key: string, value: any) {
  await page.selectOption(key, { value });
}
