import { expect, type Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async expectBannerInViewport(): Promise<void> {
    await expect(this.page.getByRole('heading', {
      name: 'Full-Fledged practice website for Automation Engineers',
      exact: true,
    })).toBeInViewport();
  }
}
