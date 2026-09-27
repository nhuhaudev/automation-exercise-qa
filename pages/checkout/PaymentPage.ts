import { expect, type Locator, type Page } from '@playwright/test';
import type { PaymentData } from '../../test-data/checkout';

export class PaymentPage {
  private readonly cardNumber: Locator;

  constructor(private readonly page: Page) {
    this.cardNumber = page.locator('[data-qa="card-number"]');
  }

  async fill(data: PaymentData): Promise<void> {
    await expect(this.page).toHaveURL(/\/payment$/);
    await this.page.locator('[data-qa="name-on-card"]').fill(data.nameOnCard);
    await this.cardNumber.fill(data.cardNumber);
    await this.page.locator('[data-qa="cvc"]').fill(data.cvc);
    await this.page.locator('[data-qa="expiry-month"]').fill(data.expiryMonth);
    await this.page.locator('[data-qa="expiry-year"]').fill(data.expiryYear);
  }

  async confirmOrder(): Promise<void> {
    await this.page.getByRole('button', { name: 'Pay and Confirm Order', exact: true }).click();
  }

  async expectCardNumberRequired(): Promise<void> {
    await expect(this.cardNumber).toHaveValue('');
    await expect(this.cardNumber).toBeFocused();
    expect(await this.cardNumber.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
    await expect(this.page).toHaveURL(/\/payment$/);
    await expect(this.page.locator('#success_message')).toBeHidden();
    await expect(this.page.locator('[data-qa="order-placed"]')).toHaveCount(0);
  }
}
