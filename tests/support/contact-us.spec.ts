import { test } from '../products/fixtures';
import { SiteHeader } from '../../pages/common/SiteHeader';
import { ContactUsPage } from '../../pages/support/ContactUsPage';
import { contactAttachmentPath, contactData } from '../../test-data/support';

test.beforeEach(async ({ page }) => {
  const header = new SiteHeader(page);
  const contact = new ContactUsPage(page);
  await header.openHome();
  await header.openContactUs();
  await contact.expectReady();
});

test('TC-SUP-001 submits a contact request with an attachment', async ({ page }) => {
  const contact = new ContactUsPage(page);
  await contact.fill(contactData());
  await contact.attachFile(contactAttachmentPath);
  await contact.submit();
  await contact.expectSubmitted();
});

test('TC-SUP-002 submits a contact request without an attachment', async ({ page }) => {
  const contact = new ContactUsPage(page);
  await contact.fill(contactData());
  await contact.expectNoAttachment();
  await contact.submit();
  await contact.expectSubmitted();
});

test('TC-SUP-003 prevents a contact request when email is empty', async ({ page }) => {
  const contact = new ContactUsPage(page);
  await contact.fill({ ...contactData(), email: '' });
  await contact.submit();
  await contact.expectEmailRequired();
});
