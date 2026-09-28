import { test } from './fixtures';
import { expectApiResponse, expectProducts, type Product } from './support/assertions';

test('TC-API-001 retrieves the product list', async ({ api }) => {
  const response = await api.send('productsList');
  const body = await expectApiResponse<{ products: Product[] }>(response, 200);
  expectProducts(body.products);
});

test('TC-API-002 rejects POST to the product list', async ({ api }) => {
  const response = await api.send('productsList', { method: 'POST' });
  await expectApiResponse(response, 405, 'This request method is not supported.');
});
