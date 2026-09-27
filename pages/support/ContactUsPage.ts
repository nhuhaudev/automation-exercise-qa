import { expect, type Dialog, type Locator, type Page } from '@playwright/test';
import { waitForEventHandler } from '../common/waitForEventHandler';
import type { ContactData } from '../../test-data/support';

export class ContactUsPage {
  private readonly form: Locator;
  private readonly email: Locator;
  private readonly attachment: Locator;
  private readonly success: Locator;

  constructor(private readonly page: Page) {
    this.form = page.locator('#contact-us-form');
    this.email = this.form.locator('[data-qa="email"]');
    this.attachment = this.form.locator('input[name="upload_file"]');
    this.success = page.locator('#contact-page').getByText('Success! Your details have been submitted successfully.', { exact: true });
  }

  async expectReady(): Promise<void> {
    await expect(this.page).toHaveURL(/\/contact_us$/);
    await expect(this.page.getByRole('heading', { name: 'Get In Touch', exact: true })).toBeVisible();
    await expect(this.form).toBeVisible();
  }

  async fill(data: ContactData): Promise<void> {
    await this.form.locator('[data-qa="name"]').fill(data.name);
    await this.email.fill(data.email);
    await this.form.locator('[data-qa="subject"]').fill(data.subject);
    await this.form.locator('[data-qa="message"]').fill(data.message);
  }

  async attachFile(path: string): Promise<void> {
    await this.attachment.setInputFiles(path);
    await expect.poll(() => this.attachment.evaluate((input: HTMLInputElement) => input.files?.length)).toBe(1);
  }

  async expectNoAttachment(): Promise<void> {
    await expect.poll(() => this.attachment.evaluate((input: HTMLInputElement) => input.files?.length)).toBe(0);
  }

  async submit(): Promise<void> {
    await waitForEventHandler(this.form, 'submit');
    const acceptConfirmation = async (dialog: Dialog) => { await dialog.accept(); };
    this.page.on('dialog', acceptConfirmation);
    try {
      await this.form.getByRole('button', { name: 'Submit', exact: true }).click();
    } finally {
      this.page.off('dialog', acceptConfirmation);
    }
  }

  async expectSubmitted(): Promise<void> {
    await expect(this.success).toBeVisible();
  }

  async expectEmailRequired(): Promise<void> {
    await expect(this.email).toHaveValue('');
    await expect(this.email).toBeFocused();
    expect(await this.email.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
    await expect(this.form).toBeVisible();
    await expect(this.page).toHaveURL(/\/contact_us$/);
    await expect(this.success).toBeHidden();
  }
}
