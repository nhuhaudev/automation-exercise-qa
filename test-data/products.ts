import { randomUUID } from 'node:crypto';

export const productSearch = {
  primary: 'top',
  secondary: 'jean',
} as const;

export const productBrowse = {
  womenCategory: 'Women',
  womenSubcategory: 'Dress',
  menCategory: 'Men',
  menSubcategory: 'Tshirts',
  firstBrand: 'Polo',
  secondBrand: 'H&M',
} as const;

export type ReviewData = {
  name: string;
  email: string;
  text: string;
};

export function reviewData(): ReviewData {
  const domain = process.env.TEST_EMAIL?.split('@')[1] ?? 'example.com';
  return {
    name: 'AEQA Reviewer',
    email: `aeqa-review-${randomUUID()}@${domain}`,
    text: 'The product details were clear and useful.',
  };
}
