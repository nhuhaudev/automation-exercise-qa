import { test } from './fixtures';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { SiteHeader } from '../../pages/common/SiteHeader';

test('TC-PROD-001 opens the Products page', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);

  await header.openHome();
  await header.openProducts();
  await listing.expectAllProducts();
});

test('TC-PROD-002 displays available products', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);

  await header.openHome();
  await header.openProducts();
  await listing.expectAllProducts();
  await listing.expectProductsVisible();
});
