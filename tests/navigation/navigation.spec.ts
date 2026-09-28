import { test } from '../products/fixtures';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { SiteFooter } from '../../pages/common/SiteFooter';
import { ScrollToTop } from '../../pages/common/ScrollToTop';
import { HomePage } from '../../pages/navigation/HomePage';
import { TestCasesPage } from '../../pages/navigation/TestCasesPage';

test('TC-NAV-001 opens the Test Cases page from Home', async ({ page }) => {
  const header = new SiteHeader(page);
  await header.openHome();
  await header.openTestCases();
  await new TestCasesPage(page).expectOpened();
});

test('TC-NAV-003 returns to the top of Home using the scroll arrow', async ({ page }) => {
  await new SiteHeader(page).openHome();
  await new SiteFooter(page).expectSubscriptionVisible();
  await new ScrollToTop(page).returnToTop();
  await new HomePage(page).expectBannerInViewport();
});
