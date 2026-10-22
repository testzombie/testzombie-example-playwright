import { TestZombie } from '@testzombie/playwright';
import { ProjectPage } from '../src/pages/project-page.js';
import { MutationLevel } from '../src/support/mutation-level.js';
import { DemoLogger } from '../src/support/demo-logger.js';
import { expect, test } from './test.js';

/**
 * Discovery intentionally runs against mutation level OFF.
 *
 * The purpose of this test is not to demonstrate healing. It shows TestZombie
 * a stable, successful business flow so it can collect page, element and
 * interaction context for AI Test Design.
 */
TestZombie.configure({
  discoveryEnabled: true,
  discoveryFileEnabled: true,
  discoveryFilePath: 'test-results/testzombie-discovery-{testRunId}.json',
});

test('Discover stable onboarding flow at mutation level OFF @discovery', async ({ page }) => {
  DemoLogger.info('SCENARIO', 'Discovery: stable workspace onboarding');
  DemoLogger.info('DISCOVERY', 'Collecting context from a successful Level 0 flow');

  const project = await new ProjectPage(page).open();
  await project.disableRandomOverlay();
  await project.setMutationLevel(MutationLevel.OFF);
  await project.enterOwner('qa+discovery@testzombie.ai', 'QA Engineer');
  await project.chooseProjectType('Web');

  const checkout = await project.continueToPlan();
  expect(await checkout.persistedMutationLevel()).toBe(MutationLevel.OFF);

  await checkout.choosePlan('Professional');
  await checkout.enterBilling('TestZombie QA GmbH', 'Invoice');

  const admin = await checkout.continueToConfiguration();
  expect(await admin.persistedMutationLevel()).toBe(MutationLevel.OFF);

  await admin.configureWorkspace('Discovery Example Workspace');
  await admin.activateWorkspace();

  const title = await admin.completionTitle();
  expect(title).toContain('Workspace successfully created');

  await admin.closeCompletionDialog();
});
