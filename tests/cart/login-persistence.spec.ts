import { test } from '../products/fixtures';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { AddToCartModal } from '../../pages/common/AddToCartModal';
import { SignupLoginPage } from '../../pages/auth/SignupLoginPage';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { CartPage } from '../../pages/cart/CartPage';
import { existingCredentials } from '../../test-data/auth';
import { productSearch } from '../../test-data/products';

test('TC-CART-008 preserves searched products in the cart after login', async ({ page }) => {
  const credentials = existingCredentials();
  const header = new SiteHeader(page);
  const listing = new ProductListingPage(page);
  const cart = new CartPage(page);
  const login = new SignupLoginPage(page);

  await header.openHome();
  await header.expectLoggedOut();
  await header.openProducts();
  await listing.search(productSearch.primary);
  await listing.expectSearchResults(productSearch.primary);
  const product = await listing.addProduct();
  await new AddToCartModal(page).viewCart();
  await cart.expectProductDetails(product);
  await header.openSignupLogin();
  await login.expectLoginForm();
  await login.login(credentials.email, credentials.password);
  await header.expectLoggedIn();
  await header.openCart();
  // Login can merge the guest cart with an existing account cart; AC1 requires presence.
  await cart.expectProduct(product.id, product.name);
});
