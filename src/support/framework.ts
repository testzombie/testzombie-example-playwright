/**
 * Central TestZombie integration seam.
 *
 * Runtime test/expect come from @testzombie/playwright so the page fixture is
 * transparently wrapped with TestZombie healing. Playwright types are re-exported
 * from the original package to keep full editor/type support.
 */
export { expect, test } from '@testzombie/playwright';
export type { Locator, Page, TestInfo } from '@playwright/test';
