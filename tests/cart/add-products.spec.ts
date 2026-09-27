import { test } from '../products/fixtures';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { AddToCartModal } from '../../pages/common/AddToCartModal';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { CartPage } from '../../pages/cart/CartPage';

test('TC-CART-001 adds one selected product to the cart', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);

  await header.openHome();
  await header.openProducts();
  const product = await listing.addProduct();
  await new AddToCartModal(page).viewCart();
  await new CartPage(page).expectProductDetails(product);
});

test('TC-CART-002 adds two products with correct prices, quantities, and totals', async ({ page }) => {
  const listing = new ProductListingPage(page);
  const modal = new AddToCartModal(page);
  const cart = new CartPage(page);

  // CSV precondition: the user is already on Products; home navigation is not under test.
  await listing.open();
  const first = await listing.addProduct();
  await modal.continueShopping();
  const second = await listing.addProduct(1);
  await modal.viewCart();
  await cart.expectProductDetails(first);
  await cart.expectProductDetails(second);
});

test('TC-CART-003 keeps the first product after continuing shopping', async ({ page }) => {
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);
  const modal = new AddToCartModal(page);
  const cart = new CartPage(page);

  await header.openHome();
  await header.openProducts();
  const first = await listing.addProduct();
  await modal.continueShopping();
  await listing.expectAllProducts();
  const second = await listing.addProduct(1);
  await modal.continueShopping();
  await header.openCart();
  await cart.expectProductDetails(first);
  await cart.expectProductDetails(second);
});
