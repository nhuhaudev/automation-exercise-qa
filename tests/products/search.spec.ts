import { test } from './fixtures';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { productSearch } from '../../test-data/products';

test('TC-PROD-005 finds products related to top', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);

  await header.openHome();
  await header.openProducts();
  await listing.search(productSearch.primary);
  await listing.expectSearchResults(productSearch.primary);
});

test('TC-PROD-006 finds products related to jean', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);

  await header.openHome();
  await header.openProducts();
  await listing.search(productSearch.secondary);
  await listing.expectSearchResults(productSearch.secondary);
});
