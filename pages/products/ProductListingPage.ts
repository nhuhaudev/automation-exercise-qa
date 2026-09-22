import { expect, type Locator, type Page } from '@playwright/test';

export class ProductListingPage {
  private readonly cards: Locator;

  constructor(private readonly page: Page) {
    this.cards = page.locator('.features_items .product-image-wrapper');
  }

  async expectAllProducts(): Promise<void> {
    await expect(this.page).toHaveURL(/\/products$/);
    await expect(this.page.getByRole('heading', { name: 'All Products', exact: true })).toBeVisible();
  }

  async expectProductsVisible(): Promise<void> {
    await expect(this.cards.first()).toBeVisible();
    await expect(this.cards.first().locator('.productinfo p')).toHaveText(/\S/);
  }

  async openFirstProduct(): Promise<void> {
    await this.cards.first().getByRole('link', { name: /View Product/ }).click();
  }

  async search(keyword: string): Promise<void> {
    await this.page.getByPlaceholder('Search Product').fill(keyword);
    // This button has no native form submit; the site attaches its click handler with jQuery.
    await this.page.waitForFunction(() => {
      const button = document.querySelector('#submit_search');
      const jquery = (window as Window & {
        jQuery?: { _data: (element: Element, key: string) => { click?: unknown[] } | undefined };
      }).jQuery;
      return Boolean(button && jquery?._data(button, 'events')?.click?.length);
    });
    await this.page.locator('#submit_search').click();
  }

  async expectSearchResults(keyword: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
    await expect(this.page).toHaveURL(new RegExp(`[?&]search=${keyword}(?:&|$)`));
    await this.expectProductsVisible();
    await expect(this.cards.first().locator('.productinfo p')).toContainText(new RegExp(keyword, 'i'));
  }

  async expectBrowseResults(heading: RegExp): Promise<void> {
    await expect(this.page.locator('.features_items h2.title')).toHaveText(heading);
    await this.expectProductsVisible();
  }
}
