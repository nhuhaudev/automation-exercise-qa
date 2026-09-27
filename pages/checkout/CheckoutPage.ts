import { expect, type Page } from '@playwright/test';
import type { RegistrationData } from '../../test-data/auth';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async expectReady(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout$/);
    await expect(this.page.getByRole('heading', { name: 'Address Details', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Review Your Order', exact: true })).toBeVisible();
  }

  async placeOrder(comment: string): Promise<void> {
    await this.page.locator('textarea[name="message"]').fill(comment);
    await this.page.getByRole('link', { name: 'Place Order', exact: true }).click();
    await expect(this.page).toHaveURL(/\/payment$/);
  }

  async expectAddress(kind: 'delivery' | 'invoice', data: RegistrationData): Promise<void> {
    const address = this.page.locator(`#address_${kind}`);
    await expect(address).toBeVisible();
    await expect(address.locator('li').filter({ hasNot: this.page.locator('h3') })).toHaveText([
      `Mr. ${data.firstName} ${data.lastName}`,
      '', // Company is optional and omitted during registration.
      data.address,
      '', // Address line 2 is optional and omitted during registration.
      `${data.city} ${data.state} ${data.zipcode}`,
      data.country,
      data.mobileNumber,
    ]);
  }
}
