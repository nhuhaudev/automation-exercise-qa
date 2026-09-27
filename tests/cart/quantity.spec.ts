import { test } from '../products/fixtures';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { AddToCartModal } from '../../pages/common/AddToCartModal';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { ProductDetailPage } from '../../pages/products/ProductDetailPage';
import { CartPage } from '../../pages/cart/CartPage';
import { cartQuantity } from '../../test-data/cart';

test('TC-CART-004 preserves selected quantity 4 in the cart', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);
  const detail = new ProductDetailPage(page);

  await header.openHome();
  await header.openProducts();
  await listing.openFirstProduct();
  await detail.expectOpen();
  await detail.setQuantity(cartQuantity.selected);
  const productId = await detail.addToCart();
  await new AddToCartModal(page).viewCart();
  await new CartPage(page).expectQuantity(productId, cartQuantity.selected);
});

test('TC-CART-005 carries the unchanged default quantity into the cart', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);
  const detail = new ProductDetailPage(page);

  await header.openHome();
  await header.openProducts();
  await listing.openFirstProduct();
  await detail.expectOpen();
  const defaultQuantity = await detail.getQuantity();
  const productId = await detail.addToCart();
  await new AddToCartModal(page).viewCart();
  await new CartPage(page).expectQuantity(productId, defaultQuantity);
});
