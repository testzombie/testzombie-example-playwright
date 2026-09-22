import type { Page } from '../support/framework.js';
import { DemoLogger } from '../support/demo-logger.js';
import { BasePage } from './base-page.js';
import { CheckoutPage } from './checkout-page.js';

export class ProjectPage extends BasePage {
  // Keep selectors intentionally equivalent to the Selenium example.
  // Do not add fallbacks here: locator repair belongs to TestZombie.
  private static readonly OWNER_EMAIL = 'input[name="email"]';
  private static readonly OWNER_ROLE = '#role';
  private static readonly SAVE_OWNER = '#saveOwnerButton';
  private static readonly PROJECT_TYPE_WEB = 'button[data-tab="web"]';
  private static readonly PROJECT_TYPE_API = 'button[data-tab="api"]';
  private static readonly CONTINUE_TO_PLAN = '#continueToCheckout';

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<this> {
    DemoLogger.navigation('Projektseite');
    await this.page.goto(`${this.baseUrl}/`);
    return this;
  }

  async disableRandomOverlay(): Promise<this> {
    DemoLogger.step('Zufälliges Demo-Overlay deaktivieren');
    await this.page.evaluate(() => {
      localStorage.setItem('tz-random-overlay', 'off');
      document
        .querySelectorAll('.random-blocking-overlay, .overlay-scrim')
        .forEach(element => element.remove());
      const toggle = document.getElementById('randomOverlayToggle') as HTMLInputElement | null;
      if (toggle) {
        toggle.checked = false;
      }
    });
    DemoLogger.pass('Zufälliges Overlay deaktiviert');
    return this;
  }

  async enterOwner(email: string, role: string): Promise<this> {
    DemoLogger.step('Projektverantwortlichen erfassen');
    await this.type(ProjectPage.OWNER_EMAIL, email);
    await this.selectByText(ProjectPage.OWNER_ROLE, role);
    await this.click(ProjectPage.SAVE_OWNER);
    return this;
  }

  async chooseProjectType(type: 'Web' | 'API'): Promise<this> {
    DemoLogger.step(`Projekttyp auswählen: ${type}`);
    const selector = type === 'Web'
      ? ProjectPage.PROJECT_TYPE_WEB
      : ProjectPage.PROJECT_TYPE_API;
    await this.click(selector);
    return this;
  }

  async continueToPlan(): Promise<CheckoutPage> {
    DemoLogger.step('Zur Plan-Auswahl navigieren');
    await this.click(ProjectPage.CONTINUE_TO_PLAN);
    await this.waitForUrlContaining('checkout');
    return new CheckoutPage(this.page);
  }

  /**
   * Equivalent to the Selenium demo's intentionally invalid
   * By.xpath("Confirm Critical Action") call. The native Playwright locator
   * cannot resolve this expression, so @testzombie/playwright exercises the
   * existing findElement/AI-healing backend path.
   */
  async aiCall(findString: string): Promise<void> {
    DemoLogger.step(`Forced AI-Healing: ${findString}`);
    await this.page.locator(`xpath=${findString}`).click();
  }
}
