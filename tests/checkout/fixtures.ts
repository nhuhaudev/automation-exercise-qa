import { test as base } from '../products/fixtures';
import { AccountInformationPage } from '../../pages/auth/AccountInformationPage';
import { AccountResultPage } from '../../pages/auth/AccountResultPage';
import { SignupLoginPage } from '../../pages/auth/SignupLoginPage';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { AddToCartModal } from '../../pages/common/AddToCartModal';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { CartPage } from '../../pages/cart/CartPage';
import { CheckoutPage } from '../../pages/checkout/CheckoutPage';
import { PaymentPage } from '../../pages/checkout/PaymentPage';
import { OrderConfirmationPage } from '../../pages/checkout/OrderConfirmationPage';
import { orderComment, paymentData } from '../../test-data/checkout';
import { registrationData, type RegistrationData } from '../../test-data/auth';
import type { ProductSummary } from '../../pages/products/ProductListingPage';

type CheckoutAccount = { data: RegistrationData; register: () => Promise<void> };

export const test = base.extend<{
  account: CheckoutAccount;
  cartWithProduct: () => Promise<ProductSummary>;
  checkout: CheckoutPage;
  order: OrderConfirmationPage;
}>({
  order: async ({ page, checkout }, use) => {
    await checkout.placeOrder(orderComment);
    const payment = new PaymentPage(page);
    await payment.fill(paymentData);
    await payment.confirmOrder();
    await use(new OrderConfirmationPage(page));
  },
  checkout: async ({ page, account, cartWithProduct }, use) => {
    const header = new SiteHeader(page);
    // Prepare the cart first so setup does not need an extra full homepage load.
    const product = await cartWithProduct();
    await header.openSignupLogin();
    await account.register();
    await header.openCart();
    const cart = new CartPage(page);
    await cart.expectProductDetails(product);
    await cart.proceedToCheckout();
    const checkout = new CheckoutPage(page);
    await checkout.expectReady();
    await use(checkout);
  },
  account: async ({ page }, use) => {
    const data = registrationData();
    let created = false;
    const header = new SiteHeader(page);
    const result = new AccountResultPage(page);
    await use({
      data,
      register: async () => {
        await new SignupLoginPage(page).startSignup(data.name, data.email);
        await new AccountInformationPage(page).createAccount(data);
        await result.expectCreated();
        created = true;
        await result.continue();
        await header.expectLoggedInAs(data.name);
      },
    });
    if (created) {
      // The account is unique to this test; never delete the configured existing user.
      await header.deleteAccount();
      await result.expectDeleted();
    }
  },
  cartWithProduct: async ({ page }, use) => {
    await use(async () => {
      const listing = new ProductListingPage(page);
      await listing.open();
      const product = await listing.addProduct();
      await new AddToCartModal(page).viewCart();
      await new CartPage(page).expectProductDetails(product);
      return product;
    });
  },
});
