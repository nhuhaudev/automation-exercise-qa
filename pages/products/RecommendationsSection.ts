import { expect, type Locator, type Page } from '@playwright/test';

export class RecommendationsSection {
  private readonly section: Locator;
  private readonly carousel: Locator;

  constructor(private readonly page: Page) {
    this.section = page.locator('.recommended_items');
    this.carousel = page.locator('#recommended-item-carousel');
  }

  async expectVisible(): Promise<void> {
    await this.section.getByRole('heading', { name: 'recommended items' }).scrollIntoViewIfNeeded();
    await expect(this.section.getByRole('heading', { name: 'recommended items' })).toBeVisible();
    await expect(this.carousel.locator('.item.active .product-image-wrapper').first()).toBeVisible();
  }

  async addVisibleProductAndViewCart(): Promise<string> {
    await this.expectVisible();
    await this.carousel.hover();
    const addToCart = this.carousel.locator('.item.active .productinfo .add-to-cart').first();
    const productId = await addToCart.getAttribute('data-product-id');
    if (!productId) throw new Error('The recommended product has no product ID.');
    await addToCart.click();
    const modal = this.page.locator('#cartModal');
    await expect(modal).toBeVisible();
    await modal.getByRole('link', { name: 'View Cart' }).click();
    return productId;
  }
}
