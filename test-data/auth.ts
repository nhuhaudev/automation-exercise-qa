import { randomUUID } from 'node:crypto';

export type RegistrationData = {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
};

export function existingCredentials(): { email: string; password: string } {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  if (!email || !password) {
    throw new Error('Set TEST_EMAIL and TEST_PASSWORD for Authentication login and logout tests.');
  }
  return { email, password };
}

export function registrationData(): RegistrationData {
  const password = process.env.TEST_PASSWORD;
  if (!password) {
    throw new Error('Set TEST_PASSWORD for Authentication registration tests.');
  }

  const domain = process.env.TEST_EMAIL?.split('@')[1] ?? 'example.com';
  return {
    name: 'AEQA Test User',
    email: `aeqa-${randomUUID()}@${domain}`,
    password,
    firstName: 'AEQA',
    lastName: 'Tester',
    address: '123 Test Street',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobileNumber: '5550101234',
  };
}

export const invalidEmailFormat = 'testemail';

export function unregisteredEmail(): string {
  const domain = process.env.TEST_EMAIL?.split('@')[1] ?? 'example.com';
  return `aeqa-unregistered-${randomUUID()}@${domain}`;
}

export function wrongPassword(correctPassword: string): string {
  let candidate: string;
  do {
    candidate = randomUUID();
  } while (candidate === correctPassword);
  return candidate;
}
