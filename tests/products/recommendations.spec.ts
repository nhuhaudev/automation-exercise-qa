import { test } from './fixtures';
import { CartPage } from '../../pages/cart/CartPage';
import { RecommendationsSection } from '../../pages/products/RecommendationsSection';
import { SiteHeader } from '../../pages/common/SiteHeader';

test('TC-PROD-013 displays recommended products', async ({ page }) => {
  const header = new SiteHeader(page);
  const recommendations = new RecommendationsSection(page);

  await header.openHome();
  await recommendations.expectVisible();
});

test('TC-PROD-014 adds a recommended product to the cart', async ({ page }) => {
  const header = new SiteHeader(page);
  const recommendations = new RecommendationsSection(page);
  const cart = new CartPage(page);

  await header.openHome();
  const productId = await recommendations.addVisibleProductAndViewCart();
  await cart.expectProduct(productId);
});
