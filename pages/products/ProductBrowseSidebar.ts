import { expect, type Page } from '@playwright/test';

export class ProductBrowseSidebar {
  constructor(private readonly page: Page) {}

  async selectCategory(category: 'Women' | 'Men', subcategory: string): Promise<void> {
    const panel = this.page.locator(`#${category}`);
    await this.page.waitForFunction(() => {
      const jquery = (window as Window & { jQuery?: { fn?: { collapse?: unknown } } }).jQuery;
      return typeof jquery?.fn?.collapse === 'function';
    });
    if (!(await panel.isVisible())) {
      await this.page.locator(`#accordian a[href="#${category}"]`).click();
    }
    await expect(panel).toBeVisible();
    await panel.getByRole('link', { name: subcategory, exact: true }).click();
    await expect(this.page).toHaveURL(/\/category_products\/\d+$/);
  }

  async selectBrand(brand: string): Promise<void> {
    await this.page.locator('.brands-name').getByRole('link', { name: new RegExp(brand, 'i') }).click();
    await expect(this.page).toHaveURL(/\/brand_products\//);
  }
}
