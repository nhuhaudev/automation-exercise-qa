import { SignupLoginPage } from '../../pages/auth/SignupLoginPage';
import { test } from './fixtures';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { CartPage } from '../../pages/cart/CartPage';
import { CheckoutPage } from '../../pages/checkout/CheckoutPage';
import { PaymentPage } from '../../pages/checkout/PaymentPage';
import { ProductListingPage } from '../../pages/products/ProductListingPage';
import { orderComment, paymentData } from '../../test-data/checkout';

test('TC-CHK-001 registers during checkout and continues', async ({ page, account, cartWithProduct }) => {
  const header = new SiteHeader(page);
  const cart = new CartPage(page);
  const product = await cartWithProduct();
  await header.expectLoggedOut();
  await cart.proceedToCheckout();
  await cart.registerFromCheckout();
  await account.register();
  await header.openCart();
  await cart.expectProductDetails(product);
  await cart.proceedToCheckout();
  await new CheckoutPage(page).expectReady();
});

test('TC-CHK-002 existing user proceeds from cart to checkout', async ({ page, account, cartWithProduct }) => {
  const header = new SiteHeader(page);
  await header.openHome();
  await header.openSignupLogin();
  await account.register();
  await header.logout();
  await new SignupLoginPage(page).login(account.data.email, account.data.password);
  await header.expectLoggedInAs(account.data.name);
  await cartWithProduct();
  await new CartPage(page).proceedToCheckout();
  await new CheckoutPage(page).expectReady();
});

test('TC-CHK-003 delivery address matches registration data', async ({ checkout, account }) => {
  await checkout.expectAddress('delivery', account.data);
});

test('TC-CHK-004 billing address matches registration data', async ({ checkout, account }) => {
  await checkout.expectAddress('invoice', account.data);
});

test('TC-CHK-005 completes an order with valid payment', async ({ order }) => {
  await order.expectConfirmed();
});

test('TC-CHK-006 prevents payment when card number is empty', async ({ page, checkout }) => {
  await checkout.placeOrder(orderComment);
  const payment = new PaymentPage(page);
  await payment.fill({ ...paymentData, cardNumber: '' });
  await payment.confirmOrder();
  await payment.expectCardNumberRequired();
});

test('TC-CHK-007 downloads an invoice after a successful order', async ({ order }, testInfo) => {
  await order.expectConfirmed();
  const invoicePath = testInfo.outputPath('invoice.txt');
  await order.downloadInvoice(invoicePath);
  await testInfo.attach('invoice', { path: invoicePath, contentType: 'text/plain' });
});

test('TC-CHK-008 continues browsing after downloading an invoice', async ({ page, order, account }, testInfo) => {
  await order.expectConfirmed();
  await order.downloadInvoice(testInfo.outputPath('invoice.txt'));
  await order.continueToHome();
  const header = new SiteHeader(page);
  await header.expectLoggedInAs(account.data.name);
  await header.openProducts();
  const products = new ProductListingPage(page);
  await products.expectAllProducts();
  await products.expectProductsVisible();
});
