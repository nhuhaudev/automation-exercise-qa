import { expect, type Locator, type Page } from '@playwright/test';
import { waitForEventHandler } from './waitForEventHandler';

export class SiteFooter {
  private readonly footer: Locator;
  private readonly form: Locator;
  private readonly email: Locator;
  private readonly success: Locator;

  constructor(page: Page) {
    this.footer = page.locator('footer');
    this.form = this.footer.locator('form.searchform');
    this.email = this.form.getByPlaceholder('Your email address', { exact: true });
    this.success = this.footer.locator('#success-subscribe');
  }

  async expectSubscriptionVisible(): Promise<void> {
    const heading = this.footer.getByRole('heading', { name: 'Subscription', exact: true });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeInViewport();
    await expect(this.email).toBeVisible();
  }

  async subscribe(email: string): Promise<void> {
    await this.email.fill(email);
    await waitForEventHandler(this.form, 'submit');
    // The arrow button has no accessible name on this site.
    await this.form.locator('#subscribe').click();
  }

  async expectSubscribed(): Promise<void> {
    await expect(this.success).toBeVisible();
    await expect(this.success).toHaveText('You have been successfully subscribed!');
  }

  async expectEmailRequired(): Promise<void> {
    await expect(this.email).toHaveValue('');
    await expect(this.email).toBeFocused();
    expect(await this.email.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
    await expect(this.success).toBeHidden();
  }
}
