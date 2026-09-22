import { expect, type Locator, type Page } from '@playwright/test';
import type { ReviewData } from '../../test-data/products';

export class ProductDetailPage {
  private readonly information: Locator;
  private readonly reviewForm: Locator;

  constructor(private readonly page: Page) {
    this.information = page.locator('.product-information');
    this.reviewForm = page.locator('#review-form');
  }

  async expectOpen(): Promise<void> {
    await expect(this.page).toHaveURL(/\/product_details\/\d+$/);
    await expect(this.information).toBeVisible();
  }

  async expectCoreInformation(): Promise<void> {
    await this.expectOpen();
    await expect(this.information.getByRole('heading', { level: 2 })).toHaveText(/\S/);
    await expect(this.information.locator('p').filter({ hasText: /^Category:/ })).toHaveText(/^Category:\s*\S.+>\s*\S+/);
    await expect(this.information.locator('span > span').first()).toHaveText(/^Rs\.\s*\d+/);
    await expect(this.information.locator('p').filter({ hasText: /^Availability:/ })).toHaveText(/^Availability:\s*\S+/);
    await expect(this.information.locator('p').filter({ hasText: /^Condition:/ })).toHaveText(/^Condition:\s*\S+/);
    await expect(this.information.locator('p').filter({ hasText: /^Brand:/ })).toHaveText(/^Brand:\s*\S+/);
  }

  async expectReviewForm(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'Write Your Review' })).toBeVisible();
    await expect(this.reviewForm).toBeVisible();
  }

  async submitReview(data: ReviewData): Promise<void> {
    await this.reviewForm.getByPlaceholder('Your Name').fill(data.name);
    await this.reviewForm.getByPlaceholder('Email Address').fill(data.email);
    await this.reviewForm.getByPlaceholder('Add Review Here!').fill(data.text);
    await this.reviewForm.getByRole('button', { name: 'Submit' }).click();
  }

  async expectReviewSubmitted(): Promise<void> {
    await expect(this.reviewForm.getByText('Thank you for your review.')).toBeVisible();
  }

  async expectEmailRequired(): Promise<void> {
    const email = this.reviewForm.getByPlaceholder('Email Address');
    await expect(email).toBeFocused();
    expect(await email.evaluate((element: HTMLInputElement) => element.validity.valueMissing)).toBe(true);
    await expect(this.reviewForm.getByText('Thank you for your review.')).toBeHidden();
  }
}
