import { test } from "@playwright/test";
import { AccountResultPage } from "../../pages/auth/AccountResultPage";
import { SignupLoginPage } from "../../pages/auth/SignupLoginPage";
import { SiteHeader } from "../../pages/common/SiteHeader";
import { registrationData } from "../../test-data/auth";
import { createAndDeleteDisposableAccount } from "./support/disposableAccount";

test("TC-AUTH-012 deletes an authenticated disposable account", async ({
  page,
}) => {
  const data = registrationData();
  await createAndDeleteDisposableAccount(page, data);
});

test("TC-AUTH-013 cannot log in after account deletion", async ({ page }) => {
  const data = registrationData();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);
  const result = new AccountResultPage(page);

  await createAndDeleteDisposableAccount(page, data);
  await result.continue();
  await header.openSignupLogin();
  await signupLogin.login(data.email, data.password);
  await signupLogin.expectInvalidCredentialsError();
  await header.expectLoggedOut();
});
