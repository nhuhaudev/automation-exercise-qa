import { expect, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async expectProduct(productId: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/view_cart$/);
    const row = this.page.locator(`#product-${productId}`);
    await expect(row).toBeVisible();
    await expect(row.locator('.cart_description')).toHaveText(/\S/);
  }
}
