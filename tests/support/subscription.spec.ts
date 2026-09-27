import { test } from '../products/fixtures';
import { expect } from '@playwright/test';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { SiteFooter } from '../../pages/common/SiteFooter';
import { subscriptionEmail } from '../../test-data/support';

test('TC-SUB-001 subscribes to emails from the Home page', async ({ page }) => {
  await new SiteHeader(page).openHome();
  const footer = new SiteFooter(page);
  await footer.expectSubscriptionVisible();
  await footer.subscribe(subscriptionEmail('home'));
  await footer.expectSubscribed();
});

test('TC-SUB-002 subscribes to emails from the Cart page', async ({ page }) => {
  const header = new SiteHeader(page);
  await header.openHome();
  await header.openCart();
  await expect(page).toHaveURL(/\/view_cart$/);
  const footer = new SiteFooter(page);
  await footer.expectSubscriptionVisible();
  await footer.subscribe(subscriptionEmail('cart'));
  await footer.expectSubscribed();
});

test('TC-SUB-003 prevents subscription when email is empty', async ({ page }) => {
  await new SiteHeader(page).openHome();
  const footer = new SiteFooter(page);
  await footer.expectSubscriptionVisible();
  await footer.subscribe('');
  await footer.expectEmailRequired();
  await expect(page).toHaveURL('https://www.automationexercise.com/');
});
