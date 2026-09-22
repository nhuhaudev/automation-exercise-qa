import { test } from './fixtures';
import { ProductBrowseSidebar } from '../../pages/products/ProductBrowseSidebar';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { productBrowse } from '../../test-data/products';

test('TC-PROD-009 browses a selected brand', async ({ page }) => {
  const header = new SiteHeader(page);
  const sidebar = new ProductBrowseSidebar(page);
  const listing = new ProductListingPage(page);

  await header.openHome();
  await header.openProducts();
  await sidebar.selectBrand(productBrowse.firstBrand);
  await listing.expectBrowseResults(/Brand\s*-\s*Polo Products/i);
});

test('TC-PROD-010 switches from Polo to H&M products', async ({ page }) => {
  const header = new SiteHeader(page);
  const sidebar = new ProductBrowseSidebar(page);
  const listing = new ProductListingPage(page);

  await header.openHome();
  await header.openProducts();
  await sidebar.selectBrand(productBrowse.firstBrand);
  await listing.expectBrowseResults(/Brand\s*-\s*Polo Products/i);
  await sidebar.selectBrand(productBrowse.secondBrand);
  await listing.expectBrowseResults(/Brand\s*-\s*H&M Products/i);
});
