import { test } from './fixtures';
import { existingCredentials, unregisteredEmail, wrongPassword } from '../../test-data/auth';
import { expectApiResponse } from './support/assertions';

test('TC-API-007 verifies valid login credentials', async ({ api }) => {
  const response = await api.send('verifyLogin', { method: 'POST', form: existingCredentials() });
  await expectApiResponse(response, 200, 'User exists!');
});

test('TC-API-008 rejects login verification without email', async ({ api }) => {
  const { password } = existingCredentials();
  const response = await api.send('verifyLogin', { method: 'POST', form: { password } });
  await expectApiResponse(response, 400, 'Bad request, email or password parameter is missing in POST request.');
});

test('TC-API-009 rejects DELETE for login verification', async ({ api }) => {
  const response = await api.send('verifyLogin', { method: 'DELETE' });
  await expectApiResponse(response, 405, 'This request method is not supported.');
});

test('TC-API-010 rejects invalid login credentials', async ({ api }) => {
  const response = await api.send('verifyLogin', {
    method: 'POST',
    form: {
      email: unregisteredEmail(),
      password: wrongPassword(existingCredentials().password),
    },
  });
  await expectApiResponse(response, 404, 'User not found!');
});
