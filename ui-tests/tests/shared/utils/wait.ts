export async function wait(milliseconds = 500) {
  await page.waitForTimeout(milliseconds);
}

export async function waitForValidation() {
  await wait();
}
