import { registrationData } from './auth';

// TD-API and TD-REGISTER profile values from the manual test data sheet.
export function apiAccountData() {
  const { email, password } = registrationData();
  return {
    email,
    password,
    name: 'API Tester',
    title: 'Mr',
    birth_date: '1',
    birth_month: '1',
    birth_year: '2000',
    firstname: 'Automation',
    lastname: 'Tester',
    company: 'QA Portfolio',
    address1: '123 Test Street',
    address2: 'Suite 1',
    country: 'Canada',
    zipcode: '700000',
    state: 'Test State',
    city: 'Test City',
    mobile_number: '0900000000',
  };
}

export type ApiAccountData = ReturnType<typeof apiAccountData>;
export const updatedCompany = 'QA Portfolio Updated';
