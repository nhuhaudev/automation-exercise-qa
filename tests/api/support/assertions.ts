import { expect, type APIResponse } from '@playwright/test';
import type { ApiAccountData } from '../../../test-data/api';

export async function expectApiResponse<T extends object>(
  response: APIResponse,
  responseCode: number,
  message?: string,
): Promise<T> {
  // This practice API reports application codes in JSON separately from HTTP status.
  expect(response.status(), 'HTTP transport status').toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('responseCode', responseCode);
  if (message !== undefined) expect(body).toHaveProperty('message', message);
  return body as T;
}

export type Product = {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: { usertype: { usertype: string }; category: string };
};

export function expectProducts(products: Product[]): void {
  expect(Array.isArray(products), 'Products should be an array').toBe(true);
  expect(products.length).toBeGreaterThan(0);
  for (const product of products) {
    expect(product).toMatchObject({
      id: expect.any(Number),
      name: expect.stringMatching(/\S/),
      price: expect.stringMatching(/^Rs\.\s*\d+$/),
      brand: expect.stringMatching(/\S/),
      category: {
        usertype: { usertype: expect.stringMatching(/\S/) },
        category: expect.stringMatching(/\S/),
      },
    });
    expect(product.id).toBeGreaterThan(0);
  }
  expect(new Set(products.map(product => product.id)).size).toBe(products.length);
}

export async function expectAccount(response: APIResponse, data: ApiAccountData): Promise<void> {
  const body = await expectApiResponse<{ user: { id: number } }>(response, 200);
  expect(body.user).toMatchObject({
    id: expect.any(Number),
    name: data.name,
    email: data.email,
    title: data.title,
    birth_day: data.birth_date,
    birth_month: data.birth_month,
    birth_year: data.birth_year,
    first_name: data.firstname,
    last_name: data.lastname,
    company: data.company,
    address1: data.address1,
    address2: data.address2,
    country: data.country,
    state: data.state,
    city: data.city,
    zipcode: data.zipcode,
  });
  expect(body.user.id).toBeGreaterThan(0);
}
