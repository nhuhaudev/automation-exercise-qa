import type { Locator } from '@playwright/test';
import { waitForEventHandler } from './waitForEventHandler';

// These controls rely on jQuery handlers attached after the HTML becomes actionable.
export async function clickWhenReady(control: Locator): Promise<void> {
  await waitForEventHandler(control, 'click');
  await control.click();
}
