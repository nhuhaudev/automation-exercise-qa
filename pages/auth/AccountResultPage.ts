import { expect, type Page } from '@playwright/test';

export class AccountResultPage {
  constructor(private readonly page: Page) {}

  async expectCreated(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Account Created!' })).toBeVisible();
  }

  async expectDeleted(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Account Deleted!' })).toBeVisible();
  }

  async continue(): Promise<void> {
    await this.page.getByRole('link', { name: 'Continue' }).click();
  }
}
