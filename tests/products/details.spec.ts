import { test } from './fixtures';
import { ProductDetailPage } from '../../pages/products/ProductDetailPage';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { SiteHeader } from '../../pages/common/SiteHeader';

test('TC-PROD-003 opens the first product detail page', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);
  const detail = new ProductDetailPage(page);

  await header.openHome();
  await header.openProducts();
  await listing.openFirstProduct();
  await detail.expectOpen();
});

test('TC-PROD-004 shows core product information', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);
  const detail = new ProductDetailPage(page);

  await header.openHome();
  await header.openProducts();
  await listing.openFirstProduct();
  await detail.expectCoreInformation();
});
