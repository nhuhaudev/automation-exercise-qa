import { expect, type Page } from '@playwright/test';

export class TestCasesPage {
  constructor(private readonly page: Page) {}

  async expectOpened(): Promise<void> {
    await expect(this.page).toHaveURL('https://www.automationexercise.com/test_cases');
    await expect(this.page.getByRole('heading', { name: 'Test Cases', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Test Case 1: Register User', exact: true })).toBeVisible();
  }
}
