import { expect, test } from "@playwright/test";
import { SignupLoginPage } from "../../pages/auth/SignupLoginPage";
import { SiteHeader } from "../../pages/common/SiteHeader";
import { existingCredentials } from "../../test-data/auth";

test("TC-AUTH-011 logs out an authenticated user", async ({ page }) => {
  const credentials = existingCredentials();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.login(credentials.email, credentials.password);
  await header.expectLoggedIn();
  await header.logout();

  await expect(page).toHaveURL(/\/login$/);
  await signupLogin.expectLoginForm();
  await header.expectLoggedOut();
});
