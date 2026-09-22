import { expect, type Page } from '@playwright/test';
import type { RegistrationData } from '../../test-data/auth';

export class AccountInformationPage {
  constructor(private readonly page: Page) {}

  async createAccount(data: RegistrationData): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Enter Account Information' })).toBeVisible();
    await this.page.locator('#id_gender1').check();
    await this.page.locator('#password').fill(data.password);
    await this.page.locator('#first_name').fill(data.firstName);
    await this.page.locator('#last_name').fill(data.lastName);
    await this.page.locator('#address1').fill(data.address);
    await this.page.locator('#country').selectOption({ label: data.country });
    await this.page.locator('#state').fill(data.state);
    await this.page.locator('#city').fill(data.city);
    await this.page.locator('#zipcode').fill(data.zipcode);
    await this.page.locator('#mobile_number').fill(data.mobileNumber);
    await this.page.getByRole('button', { name: 'Create Account' }).click();
  }
}
