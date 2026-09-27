import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

export function contactData() {
  return {
    name: 'AEQA Support Tester',
    email: `aeqa-contact-${randomUUID()}@example.com`,
    subject: 'Automation Exercise contact form test',
    message: 'This is a synthetic QA test of the practice contact form. No response is needed.',
  };
}

export type ContactData = ReturnType<typeof contactData>;

export const contactAttachmentPath = resolve(__dirname, 'support/contact-attachment.txt');

export function subscriptionEmail(source: 'home' | 'cart'): string {
  return `aeqa-subscription-${source}-${randomUUID()}@example.com`;
}
