import type { Page } from '@playwright/test';
import { AccountInformationPage } from '../../../pages/auth/AccountInformationPage';
import { AccountResultPage } from '../../../pages/auth/AccountResultPage';
import { SignupLoginPage } from '../../../pages/auth/SignupLoginPage';
import { SiteHeader } from '../../../pages/common/SiteHeader';
import type { RegistrationData } from '../../../test-data/auth';

export async function createAndDeleteDisposableAccount(page: Page, data: RegistrationData): Promise<void> {
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);
  const accountInformation = new AccountInformationPage(page);
  const result = new AccountResultPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.startSignup(data.name, data.email);
  await accountInformation.createAccount(data);
  await result.expectCreated();
  await result.continue();
  await header.expectLoggedInAs(data.name);
  await header.deleteAccount();
  await result.expectDeleted();
}
