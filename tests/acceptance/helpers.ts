import type { Page } from '../../src/support/framework.js';
import { MutationLevel } from '../../src/support/mutation-level.js';

/**
 * Open one demo page with a deterministic mutation level and random overlays disabled.
 * We write localStorage before the target navigation so the application mutates during
 * its normal startup path rather than by test-side DOM manipulation.
 */
export async function openAtMutation(
  page: Page,
  path: '/' | '/checkout.html' | '/admin.html',
  level: MutationLevel,
): Promise<void> {
  await page.goto('/');
  await page.evaluate(({ mutationLevel }) => {
    localStorage.setItem('tz-random-overlay', 'off');
    localStorage.setItem('tz-mutation-level', String(mutationLevel));
  }, { mutationLevel: level });

  await page.goto(path);
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Reload the current page at another mutation level. This is used to first teach
 * TestZombie the stable/baseline locator and then exercise healing against HARD.
 */
export async function switchMutation(page: Page, level: MutationLevel): Promise<void> {
  await page.evaluate(({ mutationLevel }) => {
    localStorage.setItem('tz-random-overlay', 'off');
    localStorage.setItem('tz-mutation-level', String(mutationLevel));
  }, { mutationLevel: level });

  await page.reload({ waitUntil: 'domcontentloaded' });
}
