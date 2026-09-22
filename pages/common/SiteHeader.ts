import { expect, type Page } from '@playwright/test';

export class SiteHeader {
  constructor(private readonly page: Page) {}

  async openHome(): Promise<void> {
    await this.page.goto('https://www.automationexercise.com/');
    await expect(this.page.getByRole('link', { name: /Home/ })).toBeVisible();
  }

  async openSignupLogin(): Promise<void> {
    await this.page.getByRole('link', { name: /Signup \/ Login/ }).click();
  }

  async expectLoggedInAs(name: string): Promise<void> {
    await expect(this.page.getByText(`Logged in as ${name}`)).toBeVisible();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.page.getByRole('listitem').filter({ hasText: /Logged in as/ })).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('link', { name: /Logout/ }).click();
  }

  async deleteAccount(): Promise<void> {
    await this.page.getByRole('link', { name: /Delete Account/ }).click();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.page.getByRole('link', { name: /Signup \/ Login/ })).toBeVisible();
    await expect(this.page.getByText(/Logged in as/)).toBeHidden();
  }
}
