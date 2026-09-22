import { expect, test as base } from '../src/support/framework.js';
import { DemoLogger } from '../src/support/demo-logger.js';

export const test = base;
export { expect };

test.beforeEach(async ({ page }, testInfo) => {
  const baseUrl = String(testInfo.project.use.baseURL ?? process.env.BASE_URL ?? 'http://demoweb2.testzombie.ai')
    .replace(/\/$/, '');
  const headless = Boolean(testInfo.project.use.headless);

  DemoLogger.startTest(testInfo.title, baseUrl, testInfo.project.name, headless);
  DemoLogger.step('Browser starten und Demo öffnen');

  await page.goto(`${baseUrl}/`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  DemoLogger.pass('Demo geladen und lokaler Zustand zurückgesetzt');
});

test.afterEach(async ({}, testInfo) => {
  const success = testInfo.status === testInfo.expectedStatus;
  if (!success && testInfo.error) {
    DemoLogger.failure('Test failed', testInfo.error);
  }
  DemoLogger.finish(success);
});
