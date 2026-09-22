import { test } from "@playwright/test";
import { AccountInformationPage } from "../../pages/auth/AccountInformationPage";
import { AccountResultPage } from "../../pages/auth/AccountResultPage";
import { SignupLoginPage } from "../../pages/auth/SignupLoginPage";
import { SiteHeader } from "../../pages/common/SiteHeader";
import { existingCredentials, invalidEmailFormat, registrationData } from "../../test-data/auth";

test("TC-AUTH-001 registers a new user", async ({ page }) => {
  const data = registrationData();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);
  const accountInformation = new AccountInformationPage(page);
  const result = new AccountResultPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.expectSignupForm();
  await signupLogin.startSignup(data.name, data.email);
  await accountInformation.createAccount(data);
  await result.expectCreated();
  await result.continue();
  await header.expectLoggedInAs(data.name);
});

test("TC-AUTH-002 rejects an existing email during signup", async ({ page }) => {
  const existing = existingCredentials();
  const data = registrationData();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.expectSignupForm();
  await signupLogin.startSignup(data.name, existing.email);
  await signupLogin.expectExistingEmailError();
  await header.expectLoggedOut();
});

test("TC-AUTH-003 requires a signup name", async ({ page }) => {
  const data = registrationData();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.startSignup('', data.email);
  await signupLogin.expectSignupValidation('Name', 'valueMissing');
  await header.expectLoggedOut();
});

test("TC-AUTH-004 requires a signup email", async ({ page }) => {
  const data = registrationData();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.startSignup(data.name, '');
  await signupLogin.expectSignupValidation('Email Address', 'valueMissing');
  await header.expectLoggedOut();
});

test("TC-AUTH-005 rejects an invalid signup email format", async ({ page }) => {
  const data = registrationData();
  const header = new SiteHeader(page);
  const signupLogin = new SignupLoginPage(page);

  await header.openHome();
  await header.openSignupLogin();
  await signupLogin.startSignup(data.name, invalidEmailFormat);
  await signupLogin.expectSignupValidation('Email Address', 'typeMismatch');
  await header.expectLoggedOut();
});
