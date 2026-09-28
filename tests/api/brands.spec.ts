import { expect } from '@playwright/test';
import { test } from './fixtures';
import { expectApiResponse } from './support/assertions';

test('TC-API-003 retrieves the brand list', async ({ api }) => {
  const response = await api.send('brandsList');
  const body = await expectApiResponse<{ brands: { id: number; brand: string }[] }>(response, 200);
  expect(Array.isArray(body.brands), 'Brands should be an array').toBe(true);
  expect(body.brands.length).toBeGreaterThan(0);
  for (const brand of body.brands) {
    expect(brand).toMatchObject({ id: expect.any(Number), brand: expect.stringMatching(/\S/) });
    expect(brand.id).toBeGreaterThan(0);
  }
  expect(new Set(body.brands.map(brand => brand.id)).size).toBe(body.brands.length);
});

test('TC-API-004 rejects PUT to the brand list', async ({ api }) => {
  const response = await api.send('brandsList', { method: 'PUT' });
  await expectApiResponse(response, 405, 'This request method is not supported.');
});
