import { test } from '../products/fixtures';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { AddToCartModal } from '../../pages/common/AddToCartModal';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { CartPage } from '../../pages/cart/CartPage';

test('TC-CART-006 removes a product from the cart', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);
  const cart = new CartPage(page);

  await header.openHome();
  await header.openProducts();
  const product = await listing.addProduct();
  await new AddToCartModal(page).viewCart();
  await cart.removeProduct(product.id);
  await cart.expectProductRemoved(product.id);
});

test('TC-CART-007 removes one product while keeping the other product', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);
  const modal = new AddToCartModal(page);
  const cart = new CartPage(page);

  await header.openHome();
  await header.openProducts();
  const first = await listing.addProduct();
  await modal.continueShopping();
  const second = await listing.addProduct(1);
  await modal.viewCart();
  await cart.expectProductDetails(first);
  await cart.expectProductDetails(second);
  await cart.removeProduct(first.id);
  await cart.expectProductRemoved(first.id);
  await cart.expectProductDetails(second);
});
