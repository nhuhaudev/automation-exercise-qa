import { expect, test as base } from '@playwright/test';
import { AutomationExerciseApi } from './support/AutomationExerciseApi';
import { apiAccountData, type ApiAccountData } from '../../test-data/api';
import { expectApiResponse } from './support/assertions';

export const test = base.extend<{
  api: AutomationExerciseApi;
  accountData: ApiAccountData;
  registeredAccount: ApiAccountData;
}>({
  api: async ({ request }, use) => {
    await use(new AutomationExerciseApi(request));
  },
  registeredAccount: async ({ api, accountData }, use) => {
    await expectApiResponse(await api.send('createAccount', {
      method: 'POST', form: accountData,
    }), 201, 'User created!');
    await use(accountData);
  },
  accountData: async ({ api }, use) => {
    const data = apiAccountData();
    try {
      await use(data);
    } finally {
      // Always check cleanup, even when creation assertions fail. Only this test's
      // UUID email is eligible for deletion; the configured existing user is never changed.
      const form = { email: data.email, password: data.password };
      const response = await api.send('verifyLogin', { method: 'POST', form });
      expect(response.status(), 'Cleanup lookup HTTP status').toBe(200);
      const body = await response.json();
      expect([200, 404], 'Cleanup lookup application status').toContain(body.responseCode);
      if (body.responseCode === 200) {
        expect(body.message).toBe('User exists!');
        await expectApiResponse(await api.send('deleteAccount', { method: 'DELETE', form }), 200, 'Account deleted!');
      } else {
        expect(body.message).toBe('User not found!');
      }
    }
  },
});
