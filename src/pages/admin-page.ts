import { expect, type Page } from '../support/framework.js';
import { DemoLogger } from '../support/demo-logger.js';
import { BasePage } from './base-page.js';

export class AdminPage extends BasePage {
  private static readonly PROJECT_NAME = 'input[data-testid="project-name"]';
  private static readonly SAVE_RULES = '#saveRulesButton';
  private static readonly ACTIVATE_WORKSPACE = '#activateWorkspace';

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<this> {
    DemoLogger.navigation('Workspace-Konfiguration');
    await this.page.goto(`${this.baseUrl}/admin.html`);
    return this;
  }

  async configureWorkspace(projectName: string): Promise<this> {
    DemoLogger.step(`Workspace konfigurieren: ${projectName}`);
    await this.type(AdminPage.PROJECT_NAME, projectName);
    await this.click(AdminPage.SAVE_RULES);
    return this;
  }

  async activateWorkspace(): Promise<this> {
    DemoLogger.step('Workspace aktivieren');
    await this.click(AdminPage.ACTIVATE_WORKSPACE);

    // The completion dialog is the functional success signal of the whole flow.
    // Use a semantic Playwright locator here instead of forcing an additional
    // CSS-healing round after all mutation/healing scenarios already succeeded.
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    return this;
  }

  async completionTitle(): Promise<string> {
    DemoLogger.step('Abschlussdialog prüfen');
    const dialog = this.page.getByRole('dialog');
    const title = dialog.getByRole('heading', { name: 'Workspace successfully created' });
    await expect(title).toBeVisible({ timeout: 15_000 });
    return (await title.innerText()).trim();
  }

  async closeCompletionDialog(): Promise<this> {
    DemoLogger.step('Abschlussdialog schließen');
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Close onboarding summary' }).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    return this;
  }
}
