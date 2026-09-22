import { test } from './fixtures';
import { ProductDetailPage } from '../../pages/products/ProductDetailPage';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { reviewData } from '../../test-data/products';

test('TC-PROD-011 submits a valid product review', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);
  const detail = new ProductDetailPage(page);
  const data = reviewData();

  await header.openHome();
  await header.openProducts();
  await listing.openFirstProduct();
  await detail.expectReviewForm();
  await detail.submitReview(data);
  await detail.expectReviewSubmitted();
});

test('TC-PROD-012 requires an email for product review', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);
  const detail = new ProductDetailPage(page);
  const data = reviewData();

  await header.openHome();
  await header.openProducts();
  await listing.openFirstProduct();
  await detail.expectReviewForm();
  await detail.submitReview({ ...data, email: '' });
  await detail.expectEmailRequired();
});
