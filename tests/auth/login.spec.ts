import { test } from "@playwright/test";
import { SignupLoginPage } from "../../pages/auth/SignupLoginPage";
import { SiteHeader } from "../../pages/common/SiteHeader";
import { existingCredentials, unregisteredEmail, wrongPassword } from "../../test-data/auth";

test("TC-AUTH-006 logs in with valid credentials", async ({ page }) => {
  const credentials = existingCredentials();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.expectLoginForm();
  await signupLogin.login(credentials.email, credentials.password);
  await header.expectLoggedIn();
});

test("TC-AUTH-007 rejects an unregistered email", async ({ page }) => {
  const credentials = existingCredentials();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.login(unregisteredEmail(), credentials.password);
  await signupLogin.expectInvalidCredentialsError();
  await header.expectLoggedOut();
});

test("TC-AUTH-008 rejects an incorrect password", async ({ page }) => {
  const credentials = existingCredentials();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.login(credentials.email, wrongPassword(credentials.password));
  await signupLogin.expectInvalidCredentialsError();
  await header.expectLoggedOut();
});

test("TC-AUTH-009 requires a login email", async ({ page }) => {
  const credentials = existingCredentials();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.login('', credentials.password);
  await signupLogin.expectLoginValidation('Email Address');
  await header.expectLoggedOut();
});

test("TC-AUTH-010 requires a login password", async ({ page }) => {
  const credentials = existingCredentials();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.login(credentials.email, '');
  await signupLogin.expectLoginValidation('Password');
  await header.expectLoggedOut();
});
