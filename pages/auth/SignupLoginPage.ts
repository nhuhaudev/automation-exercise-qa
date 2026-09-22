import { expect, type Locator, type Page } from '@playwright/test';

export class SignupLoginPage {
  private readonly signupForm: Locator;
  private readonly loginForm: Locator;

  constructor(private readonly page: Page) {
    this.signupForm = page.locator('form[action="/signup"]');
    this.loginForm = page.locator('form[action="/login"]');
  }

  async expectSignupForm(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  }

  async expectLoginForm(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.signupForm.getByPlaceholder('Name').fill(name);
    await this.signupForm.getByPlaceholder('Email Address').fill(email);
    await this.signupForm.getByRole('button', { name: 'Signup' }).click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginForm.getByPlaceholder('Email Address').fill(email);
    await this.loginForm.getByPlaceholder('Password').fill(password);
    await this.loginForm.getByRole('button', { name: 'Login' }).click();
  }

  async expectExistingEmailError(): Promise<void> {
    await expect(this.signupForm.getByText('Email Address already exist!')).toBeVisible();
    await expect(this.page).toHaveURL(/\/signup$/);
    await expect(this.page.getByRole('heading', { name: 'Enter Account Information' })).toBeHidden();
  }

  async expectInvalidCredentialsError(): Promise<void> {
    await expect(this.loginForm.getByText('Your email or password is incorrect!')).toBeVisible();
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async expectSignupValidation(field: 'Name' | 'Email Address', reason: 'valueMissing' | 'typeMismatch'): Promise<void> {
    const input = this.signupForm.getByPlaceholder(field);
    await expect(input).toBeFocused();
    expect(await input.evaluate((element: HTMLInputElement, key) => element.validity[key], reason)).toBe(true);
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async expectLoginValidation(field: 'Email Address' | 'Password'): Promise<void> {
    const input = this.loginForm.getByPlaceholder(field);
    await expect(input).toBeFocused();
    expect(await input.evaluate((element: HTMLInputElement) => element.validity.valueMissing)).toBe(true);
    await expect(this.page).toHaveURL(/\/login$/);
  }
}
