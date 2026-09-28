import { expect, type Locator, type Page } from '@playwright/test';
import { clickWhenReady } from './clickWhenReady';

export class ScrollToTop {
  private readonly arrow: Locator;

  constructor(private readonly page: Page) {
    // The dynamically created arrow link has no accessible name.
    this.arrow = page.locator('#scrollUp');
  }

  async returnToTop(): Promise<void> {
    await expect(this.arrow).toBeVisible();
    await expect(this.arrow).toBeInViewport();
    await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await clickWhenReady(this.arrow);
    // Wait for the site's scroll animation to finish without moving the page ourselves.
    await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBe(0);
  }
}
