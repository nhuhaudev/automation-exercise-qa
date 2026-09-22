import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(/(?:doubleclick\.net|googlesyndication\.com|googleadservices\.com)/, route => route.abort());
    await use(page);
  },
});
