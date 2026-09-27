import { expect, type Locator, type Page } from '@playwright/test';
import { AddToCartModal } from '../common/AddToCartModal';
import { clickWhenReady } from '../common/clickWhenReady';

export type ProductSummary = { id: string; name: string; price: number };

export class ProductListingPage {
  private readonly cards: Locator;

  constructor(private readonly page: Page) {
    this.cards = page.locator('.features_items .product-image-wrapper');
  }

  async open(): Promise<void> {
    await this.page.goto('https://www.automationexercise.com/products');
    await this.expectAllProducts();
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

  async addProduct(index = 0): Promise<ProductSummary> {
    // Navigation clicks can finish at DOMContentLoaded. Images loaded afterwards
    // resize/move the card and can move it away from the pointer during hover.
    await this.page.waitForLoadState('load');
    const card = this.cards.nth(index);
    const information = card.locator('.productinfo');
    const button = card.locator('.product-overlay .add-to-cart');
    const id = await button.getAttribute('data-product-id');
    if (!id) throw new Error('The listed product has no product ID.');
    const name = (await information.locator('p').innerText()).trim();
    const priceText = await information.locator('h2').innerText();
    expect(priceText).toMatch(/^Rs\.\s*\d+$/);
    const price = Number(priceText.replace(/^Rs\.\s*/, ''));
    // Hover reveals an animated overlay over the static product-info button.
    // Click the overlay button so Playwright waits for the moving target to settle.
    await card.locator('.single-products').hover();
    // The site opens the modal only after this AJAX request succeeds. Start
    // listening before clicking so a fast response cannot be missed.
    const [response] = await Promise.all([
      this.page.waitForResponse(response =>
        new URL(response.url()).pathname === `/add_to_cart/${id}` &&
        response.request().method() === 'GET',
      ),
      clickWhenReady(button),
    ]);
    expect(response.ok(), `Add product ${id} returned HTTP ${response.status()}`).toBe(true);
    expect(await response.finished(), `Add product ${id} response should finish`).toBeNull();
    await new AddToCartModal(this.page).expectAdded();
    return { id, name, price };
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
