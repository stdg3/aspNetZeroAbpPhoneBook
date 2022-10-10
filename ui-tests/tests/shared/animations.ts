export async function disableTransitions() {
  await page.addStyleTag({
    content: `*, *::before, *::after { transition: none!important; animation: none !important; }`,
  });
}

