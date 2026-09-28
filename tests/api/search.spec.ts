import { expect } from '@playwright/test';
import { test } from './fixtures';
import { productSearch } from '../../test-data/products';
import { expectApiResponse, expectProducts, type Product } from './support/assertions';

test('TC-API-005 searches for matching products', async ({ api }) => {
  const response = await api.send('searchProduct', {
    method: 'POST',
    form: { search_product: productSearch.primary },
  });
  const body = await expectApiResponse<{ products: Product[] }>(response, 200);
  expectProducts(body.products);
  for (const product of body.products) {
    expect(`${product.name} ${product.category.category}`.toLowerCase()).toContain(productSearch.primary);
  }
});

test('TC-API-006 rejects search without search_product', async ({ api }) => {
  const response = await api.send('searchProduct', { method: 'POST', form: {} });
  await expectApiResponse(response, 400, 'Bad request, search_product parameter is missing in POST request.');
});
