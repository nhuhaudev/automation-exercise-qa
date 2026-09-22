import { test } from './fixtures';
import { ProductBrowseSidebar } from '../../pages/products/ProductBrowseSidebar';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { productBrowse } from '../../test-data/products';

test('TC-PROD-007 browses Women Dress products', async ({ page }) => {
  const header = new SiteHeader(page);
  const sidebar = new ProductBrowseSidebar(page);
  const listing = new ProductListingPage(page);

  await header.openHome();
  await header.openProducts();
  await sidebar.selectCategory(productBrowse.womenCategory, productBrowse.womenSubcategory);
  await listing.expectBrowseResults(/Women\s*-\s*Dress Products/i);
});

test('TC-PROD-008 switches from Women Dress to Men Tshirts', async ({ page }) => {
  const header = new SiteHeader(page);
  const sidebar = new ProductBrowseSidebar(page);
  const listing = new ProductListingPage(page);

  await header.openHome();
  await header.openProducts();
  await sidebar.selectCategory(productBrowse.womenCategory, productBrowse.womenSubcategory);
  await listing.expectBrowseResults(/Women\s*-\s*Dress Products/i);
  await sidebar.selectCategory(productBrowse.menCategory, productBrowse.menSubcategory);
  await listing.expectBrowseResults(/Men\s*-\s*Tshirts Products/i);
});
