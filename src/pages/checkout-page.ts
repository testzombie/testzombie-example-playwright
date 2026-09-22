import type { Page } from '../support/framework.js';
import { DemoLogger } from '../support/demo-logger.js';
import { AdminPage } from './admin-page.js';
import { BasePage } from './base-page.js';

export class CheckoutPage extends BasePage {
  private static readonly PLAN_FREE = 'button[data-plan="Free"]';
  private static readonly PLAN_STARTER = 'button[data-plan="Starter"]';
  private static readonly PLAN_PROFESSIONAL = 'button[data-plan="Professional"]';
  private static readonly PLAN_ENTERPRISE = 'button[data-plan="Enterprise"]';
  private static readonly COMPANY = 'input[data-testid="company-input"]';
  private static readonly PAYMENT_METHOD = 'select[data-testid="payment-method"]';
  private static readonly ACCEPT_TERMS = 'input[data-testid="terms-check"]';
  private static readonly SAVE_BILLING = '#payButton';
  private static readonly CONTINUE_TO_CONFIGURATION = '#continueToAdmin';

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<this> {
    DemoLogger.navigation('Plan- und Abrechnungsseite');
    await this.page.goto(`${this.baseUrl}/checkout.html`);
    return this;
  }

  async choosePlan(plan: 'Free' | 'Starter' | 'Professional' | 'Enterprise'): Promise<this> {
    DemoLogger.step(`Plan auswählen: ${plan}`);
    const selectors: Record<typeof plan, string> = {
      Free: CheckoutPage.PLAN_FREE,
      Starter: CheckoutPage.PLAN_STARTER,
      Professional: CheckoutPage.PLAN_PROFESSIONAL,
      Enterprise: CheckoutPage.PLAN_ENTERPRISE,
    };
    await this.click(selectors[plan]);
    return this;
  }

  async enterBilling(company: string, paymentMethod: string): Promise<this> {
    DemoLogger.step('Abrechnungsdaten erfassen');
    await this.type(CheckoutPage.COMPANY, company);
    await this.selectByText(CheckoutPage.PAYMENT_METHOD, paymentMethod);
    await this.click(CheckoutPage.ACCEPT_TERMS);
    await this.click(CheckoutPage.SAVE_BILLING);
    return this;
  }

  async continueToConfiguration(): Promise<AdminPage> {
    DemoLogger.step('Zur Workspace-Konfiguration navigieren');
    await this.click(CheckoutPage.CONTINUE_TO_CONFIGURATION);
    await this.waitForUrlContaining('admin');
    return new AdminPage(this.page);
  }
}
