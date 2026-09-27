import { expect, type Locator, type Page } from '@playwright/test';

export class AddToCartModal {
  private readonly modal: Locator;

  constructor(page: Page) {
    this.modal = page.locator('#cartModal');
  }

  async expectAdded(): Promise<void> {
    await expect(this.modal).toBeVisible();
    await expect(this.modal.getByText('Your product has been added to cart.')).toBeVisible();
  }

  async continueShopping(): Promise<void> {
    await this.expectAdded();
    await this.modal.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(this.modal).toBeHidden();
  }

  async viewCart(): Promise<void> {
    await this.expectAdded();
    await this.modal.getByRole('link', { name: 'View Cart' }).click();
  }
}
