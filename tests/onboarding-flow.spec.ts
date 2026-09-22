import { ProjectPage } from '../src/pages/project-page.js';
import {
  ALL_MUTATION_LEVELS,
  baselineSuffix,
  MutationLevel,
  mutationLevelName,
} from '../src/support/mutation-level.js';
import { DemoLogger } from '../src/support/demo-logger.js';
import { expect, test } from './test.js';

for (const level of ALL_MUTATION_LEVELS) {
  test(`Complete onboarding at mutation level ${mutationLevelName(level)}${baselineSuffix(level)}`, async ({ page }) => {
    DemoLogger.info('SCENARIO', 'Vollständiges Workspace-Onboarding');
    DemoLogger.info('MUTATION', mutationLevelName(level));

    const project = await new ProjectPage(page).open();
    await project.disableRandomOverlay();
    await project.setMutationLevel(level);
    await project.enterOwner(`qa+${mutationLevelName(level).toLowerCase()}@testzombie.ai`, 'QA Engineer');
    await project.chooseProjectType('Web');

    const checkout = await project.continueToPlan();
    const checkoutLevel = await checkout.persistedMutationLevel();
    DemoLogger.verify('Mutation Level auf Plan-Seite übernommen', level, checkoutLevel);
    expect(checkoutLevel, 'Mutation level must survive navigation').toBe(level);
    DemoLogger.pass('Mutation Level auf Plan-Seite verifiziert');

    await checkout.choosePlan('Professional');
    await checkout.enterBilling('TestZombie QA GmbH', 'Invoice');

    const admin = await checkout.continueToConfiguration();
    const adminLevel = await admin.persistedMutationLevel();
    DemoLogger.verify('Mutation Level auf Konfigurationsseite übernommen', level, adminLevel);
    expect(adminLevel, 'Mutation level must survive all pages').toBe(level);
    DemoLogger.pass('Mutation Level auf Konfigurationsseite verifiziert');

    await admin.configureWorkspace(`Mutation ${level} Workspace`);
    await admin.activateWorkspace();

    const title = await admin.completionTitle();
    DemoLogger.verify(
      'Abschlussdialog bestätigt erfolgreiches Onboarding',
      'contains: Workspace successfully created',
      title,
    );
    expect(title).toContain('Workspace successfully created');
    DemoLogger.pass('Onboarding erfolgreich abgeschlossen');

    await admin.closeCompletionDialog();

    // Equivalent place for the Selenium sample's forced AI call. Native
    // Playwright uses exact text here; once @testzombie/playwright exists this
    // becomes an explicit AI/healing acceptance case.
    if (level === MutationLevel.EXTREME && process.env.RUN_FORCED_AI_DEMO === 'true') {
      DemoLogger.info('AI', 'Forced AI demo enabled');
      await page.goto('http://demoweb2.testzombie.ai/index.html');
      await project.aiCall('Confirm Critical Action');
    }
  });
}
