import { test } from './fixtures';
import { updatedCompany } from '../../test-data/api';
import { expectAccount, expectApiResponse } from './support/assertions';

test('TC-API-011 creates a new user account', async ({ api, accountData }) => {
  const response = await api.send('createAccount', { method: 'POST', form: accountData });
  await expectApiResponse(response, 201, 'User created!');
  const login = await api.send('verifyLogin', {
    method: 'POST',
    form: { email: accountData.email, password: accountData.password },
  });
  await expectApiResponse(login, 200, 'User exists!');
});

test('TC-API-012 retrieves the expected user details', async ({ api, registeredAccount }) => {
  const response = await api.send('getUserDetailByEmail', {
    params: { email: registeredAccount.email },
  });
  await expectAccount(response, registeredAccount);
});

test('TC-API-013 updates an existing account', async ({ api, registeredAccount }) => {
  const updatedAccount = { ...registeredAccount, company: updatedCompany };
  const response = await api.send('updateAccount', { method: 'PUT', form: updatedAccount });
  await expectApiResponse(response, 200, 'User updated!');
  const details = await api.send('getUserDetailByEmail', {
    params: { email: registeredAccount.email },
  });
  await expectAccount(details, updatedAccount);
});

test('TC-API-014 deletes an existing account', async ({ api, registeredAccount }) => {
  const form = { email: registeredAccount.email, password: registeredAccount.password };
  const response = await api.send('deleteAccount', { method: 'DELETE', form });
  await expectApiResponse(response, 200, 'Account deleted!');
  const login = await api.send('verifyLogin', { method: 'POST', form });
  await expectApiResponse(login, 404, 'User not found!');
});
