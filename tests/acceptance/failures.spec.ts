import { createTestZombiePage } from '@testzombie/playwright';
import { expect as nativeExpect, test as nativeTest } from '@playwright/test';
import { MutationLevel } from '../../src/support/mutation-level.js';
import { expect, test } from '../test.js';
import { openAtMutation } from './helpers.js';

test.describe('Healing safety / failure acceptance', () => {
  test('an element that truly does not exist still fails', async ({ page }) => {
    test.setTimeout(30_000);
    await openAtMutation(page, '/checkout.html', MutationLevel.HARD);

    // Remove the demo UI for this safety test. On the full checkout page an AI
    // healer may legitimately infer a semantically plausible element, which makes
    // that page unsuitable for proving the strict "nothing exists" case.
    await page.setContent(`
      <main id="acceptance-empty-page">
        <p>There is intentionally no interactive target on this page.</p>
      </main>
    `);

    let thrown: unknown = null;
    try {
      await page.locator('#tz-acceptance-element-that-does-not-exist').click({ timeout: 750 });
    } catch (error) {
      thrown = error;
    }

    nativeExpect(thrown, 'A truly missing target must not be healed into a false positive').toBeTruthy();
    nativeExpect(String((thrown as Error)?.message ?? thrown)).toContain('Element could not be healed or found');
  });

  test('negative visibility assertion is not healed into a false positive', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.HARD);

    await expect(page.locator('#tz-acceptance-element-that-does-not-exist')).not.toBeVisible();
  });

  test('hidden/detached waits remain native absence checks', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.HARD);

    await page.locator('#tz-acceptance-element-that-does-not-exist').waitFor({ state: 'hidden' });
    await page.locator('#tz-acceptance-element-that-does-not-exist').waitFor({ state: 'detached' });
  });
});

nativeTest.describe('Backend initialization behavior', () => {
  nativeTest('fail-open keeps native Playwright usable when TestZombie is unreachable', async ({ page }) => {
    const wrapped = await createTestZombiePage(page, {
      apiUrl: 'http://127.0.0.1:9/api/',
      apiKey: 'acceptance-invalid-key',
      email: 'acceptance@testzombie.invalid',
      failOpen: true,
      logLevel: 'ERRORONLY',
    });

    await wrapped.setContent('<button id="native-fallback">Native fallback works</button>');
    await wrapped.locator('#native-fallback').click();
    await nativeExpect(page.locator('#native-fallback')).toBeVisible();
  });

  nativeTest('fail-closed rejects initialization when TestZombie is unreachable', async ({ page }) => {
    await nativeExpect(
      createTestZombiePage(page, {
        apiUrl: 'http://127.0.0.1:9/api/',
        apiKey: 'acceptance-invalid-key',
        email: 'acceptance@testzombie.invalid',
        failOpen: false,
        logLevel: 'ERRORONLY',
      }),
    ).rejects.toThrow('TestZombie backend initialization failed');
  });
});
