import { expect, type Locator } from '@playwright/test';

// These controls rely on jQuery handlers attached after the HTML becomes actionable.
export async function clickWhenReady(control: Locator): Promise<void> {
  await expect.poll(() => control.evaluate(element => {
    const jquery = (window as Window & {
      jQuery?: { _data: (element: Element, key: string) => { click?: unknown[] } | undefined };
    }).jQuery;
    return Boolean(jquery?._data(element, 'events')?.click?.length);
  }), { message: 'Wait for the site to attach the control click handler' }).toBe(true);
  await control.click();
}
