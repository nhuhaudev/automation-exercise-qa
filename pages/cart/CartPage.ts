import { expect, type Page } from '@playwright/test';
import type { ProductSummary } from '../products/ProductListingPage';
import { clickWhenReady } from '../common/clickWhenReady';

export class CartPage {
  constructor(private readonly page: Page) {}

  async proceedToCheckout(): Promise<void> {
    await expect(this.page).toHaveURL(/\/view_cart$/);
    // This anchor has no href; both guest and signed-in checkout need its jQuery handler.
    await clickWhenReady(this.page.getByText('Proceed To Checkout', { exact: true }));
  }

  async registerFromCheckout(): Promise<void> {
    const modal = this.page.locator('#checkoutModal');
    await expect(modal).toBeVisible();
    await modal.getByRole('link', { name: 'Register / Login' }).click();
  }

  async removeProduct(productId: string): Promise<void> {
    await this.expectProduct(productId);
    await clickWhenReady(this.page.locator(`#product-${productId} .cart_quantity_delete`));
  }

  async expectProductRemoved(productId: string): Promise<void> {
    await expect(this.page.locator(`#product-${productId}`)).toHaveCount(0);
  }

  async expectProductDetails(product: ProductSummary, quantity = 1): Promise<void> {
    await this.expectProduct(product.id);
    const row = this.page.locator(`#product-${product.id}`);
    await expect(row.locator('.cart_description').getByRole('link')).toHaveText(product.name);
    await expect(row.locator('.cart_price')).toHaveText(`Rs. ${product.price}`);
    await this.expectQuantity(product.id, quantity);
    await expect(row.locator('.cart_total')).toHaveText(`Rs. ${product.price * quantity}`);
  }

  async expectQuantity(productId: string, quantity: number): Promise<void> {
    await this.expectProduct(productId);
    await expect(this.page.locator(`#product-${productId} .cart_quantity`)).toHaveText(String(quantity));
  }

  async expectProduct(productId: string, name?: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/view_cart$/);
    const row = this.page.locator(`#product-${productId}`);
    await expect(row).toBeVisible();
    await expect(row.locator('.cart_description')).toHaveText(/\S/);
    if (name) await expect(row.locator('.cart_description').getByRole('link')).toHaveText(name);
  }
}
