import { TestZombie } from '@testzombie/playwright';
import { ProjectPage } from '../src/pages/project-page.js';
import { MutationLevel } from '../src/support/mutation-level.js';
import { DemoLogger } from '../src/support/demo-logger.js';
import { expect, test } from './test.js';

/**
 * Code Update intentionally runs one onboarding flow on mutation level LIGHT.
 *
 * Level 1 changes locators in the demo application. TestZombie heals the
 * affected Playwright actions at runtime and, because sourceUpdateMode is
 * `apply`, writes successful healed locators back to the Page Object source.
 *
 * After the test, run `git diff src/pages` to inspect the generated updates.
 * Use `git restore src/pages` to reset the demo before running it again.
 */
TestZombie.configure({
  sourceUpdateMode: 'apply',
  sourceUpdateRoot: process.cwd(),
  discoveryEnabled: false,
});

test('Heal Level 1 onboarding and update Page Object locators @codeupdate', async ({ page }) => {
  DemoLogger.info('SCENARIO', 'Code Update: onboarding with Level 1 mutations');
  DemoLogger.info('CODE UPDATE', 'Successful healed locators will be written back to the Page Objects');

  const project = await new ProjectPage(page).open();
  await project.disableRandomOverlay();
  await project.setMutationLevel(MutationLevel.LIGHT);
  await project.enterOwner('qa+codeupdate@testzombie.ai', 'QA Engineer');
  await project.chooseProjectType('Web');

  const checkout = await project.continueToPlan();
  expect(await checkout.persistedMutationLevel()).toBe(MutationLevel.LIGHT);

  await checkout.choosePlan('Professional');
  await checkout.enterBilling('TestZombie QA GmbH', 'Invoice');

  const admin = await checkout.continueToConfiguration();
  expect(await admin.persistedMutationLevel()).toBe(MutationLevel.LIGHT);

  await admin.configureWorkspace('Code Update Example Workspace');
  await admin.activateWorkspace();

  const title = await admin.completionTitle();
  expect(title).toContain('Workspace successfully created');

  await admin.closeCompletionDialog();

  DemoLogger.info('CODE UPDATE', 'Run `git diff src/pages` to inspect the persisted locator changes');
});
