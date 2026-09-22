import type { Locator, Page } from './framework.js';
import { DemoLogger } from './demo-logger.js';

/**
 * Deliberately simple Playwright actions.
 *
 * Every interaction receives exactly one selector. There are no locator
 * fallbacks and no self-healing mechanisms in this example project. Locator
 * repair is expected to be provided by the TestZombie Playwright integration.
 *
 * Playwright already performs auto-waiting, actionability checks, scrolling
 * into view and DOM-stability retries for actions such as click(). We therefore
 * do not add Selenium-style retry loops or JavaScript click fallbacks here.
 */
export class PlaywrightActions {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async find(selector: string): Promise<Locator> {
    DemoLogger.action('Find', selector);
    const element = this.locator(selector);
    await element.waitFor({ state: 'visible' });
    DemoLogger.pass(`Element visible: ${selector}`);
    return element;
  }

  async click(selector: string): Promise<void> {
    DemoLogger.action('Click', selector);
    await this.locator(selector).click();
    DemoLogger.pass(`Clicked: ${selector}`);
  }

  async type(selector: string, value: string): Promise<void> {
    DemoLogger.action('Type', selector, value);
    await this.locator(selector).fill(value);
    DemoLogger.pass(`Value entered: ${selector}`);
  }

  async selectByText(selector: string, text: string): Promise<void> {
    DemoLogger.action('Select text', selector, text);
    await this.locator(selector).selectOption({ label: text });
    DemoLogger.pass(`Selected text '${text}': ${selector}`);
  }

  async selectByValue(selector: string, value: string): Promise<void> {
    DemoLogger.action('Select value', selector, value);
    await this.locator(selector).selectOption({ value });
    DemoLogger.pass(`Selected value '${value}': ${selector}`);
  }

  async waitForUrlContaining(value: string): Promise<void> {
    DemoLogger.info('WAIT', `URL contains '${value}'`);
    await this.page.waitForURL(url => url.toString().includes(value));
    await this.waitForDocumentReady();
    DemoLogger.pass(`URL verified: ${this.page.url()}`);
  }

  protected async waitForDocumentReady(): Promise<void> {
    await this.page.waitForLoadState('load');
    await this.page.waitForFunction(() => document.readyState === 'complete');
  }
}
