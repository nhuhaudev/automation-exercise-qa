import { expect, type Page } from '@playwright/test';
import { stat } from 'node:fs/promises';

export class OrderConfirmationPage {
  constructor(private readonly page: Page) {}

  async expectConfirmed(): Promise<void> {
    await expect(this.page).toHaveURL(/\/payment_done\/\d+$/);
    await expect(this.page.locator('[data-qa="order-placed"]')).toHaveText('Order Placed!');
    await expect(this.page.getByText('Congratulations! Your order has been confirmed!', { exact: true })).toBeVisible();
  }

  async downloadInvoice(destination: string): Promise<void> {
    const downloadEvent = this.page.waitForEvent('download');
    await this.page.getByRole('link', { name: 'Download Invoice', exact: true }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe('invoice.txt');
    expect(await download.failure()).toBeNull();
    await download.saveAs(destination);
    expect((await stat(destination)).size).toBeGreaterThan(0);
  }

  async continueToHome(): Promise<void> {
    await this.page.getByRole('link', { name: 'Continue', exact: true }).click();
    await expect(this.page).toHaveURL('https://www.automationexercise.com/');
  }
}
