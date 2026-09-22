import { MutationLevel } from '../../src/support/mutation-level.js';
import { expect, test } from '../test.js';
import { openAtMutation, switchMutation } from './helpers.js';

const EMAIL = 'input[name="email"]';

test.describe.configure({ mode: 'parallel' });

test.describe('8-worker run isolation acceptance', () => {
  for (let index = 1; index <= 8; index += 1) {
    test(`parallel healing worker ${index}`, async ({ page }, testInfo) => {
      const token = `tz-worker-${index}-p${testInfo.parallelIndex}`;
      const email = `${token}@testzombie.invalid`;

      // Prime the exact legacy locator in the stable DOM, then force HARD so every
      // worker exercises the same healing path with a unique value/context.
      await openAtMutation(page, '/', MutationLevel.OFF);
      await page.locator(EMAIL).waitFor({ state: 'visible' });
      await switchMutation(page, MutationLevel.HARD);

      await page.locator(EMAIL).fill(email);
      await expect(page.getByLabel('Email')).toHaveValue(email);

      console.log(`[TestZombie][PARALLEL] worker=${index} parallelIndex=${testInfo.parallelIndex} token=${token}`);
    });
  }
});
