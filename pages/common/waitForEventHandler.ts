import { expect, type Locator } from '@playwright/test';

// The site's jQuery controls can become visible before their handlers are attached.
export async function waitForEventHandler(control: Locator, event: 'click' | 'submit'): Promise<void> {
  await expect.poll(() => control.evaluate((element, eventName) => {
    const jquery = (window as Window & {
      jQuery?: { _data: (element: Element, key: string) => Record<string, unknown[]> | undefined };
    }).jQuery;
    return Boolean(jquery?._data(element, 'events')?.[eventName]?.length);
  }, event), { message: `Wait for the site to attach the ${event} handler` }).toBe(true);
}
