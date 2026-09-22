import type { Page } from '../support/framework.js';
import { DemoLogger } from '../support/demo-logger.js';
import { MutationLevel } from '../support/mutation-level.js';
import { PlaywrightActions } from '../support/playwright-actions.js';

export abstract class BasePage extends PlaywrightActions {
  protected static readonly MUTATION_LEVEL = '#mutationLevel';
  protected readonly baseUrl: string;

  protected constructor(page: Page) {
    super(page);
    this.baseUrl = (process.env.BASE_URL ?? 'http://demoweb2.testzombie.ai').replace(/\/$/, '');
  }

  async setMutationLevel(level: MutationLevel): Promise<void> {
    DemoLogger.step(`Mutation Level auf ${MutationLevel[level]} setzen`);
    await this.selectByValue(BasePage.MUTATION_LEVEL, String(level));
    await this.page.waitForFunction(
      expected => localStorage.getItem('tz-mutation-level') === expected,
      String(level),
    );
    DemoLogger.pass(`Mutation Level gespeichert: ${level}`);
  }

  async persistedMutationLevel(): Promise<number> {
    const value = await this.page.evaluate(() => localStorage.getItem('tz-mutation-level'));
    if (value === null) {
      throw new Error('No persisted mutation level found in localStorage');
    }
    return Number.parseInt(value, 10);
  }
}
