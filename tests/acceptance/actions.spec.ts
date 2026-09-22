import { MutationLevel } from '../../src/support/mutation-level.js';
import { expect, test } from '../test.js';
import { openAtMutation, switchMutation } from './helpers.js';

const COMPANY = 'input[data-testid="company-input"]';
const PAYMENT = 'select[data-testid="payment-method"]';
const TERMS = 'input[data-testid="terms-check"]';
const PAY_BUTTON = '#payButton';

test.describe('TestZombie Playwright action acceptance', () => {
  test('click works natively at OFF and heals at HARD', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.OFF);
    await page.locator(PAY_BUTTON).click();
    await expect(page.getByRole('button', { name: 'Start Checkout' })).toBeVisible();

    await switchMutation(page, MutationLevel.HARD);
    await page.locator(PAY_BUTTON).click();
    await expect(page.getByRole('button', { name: 'Continue Billing Flow' })).toBeVisible();
  });

  test('fill works natively at OFF and heals at HARD', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.OFF);
    await page.locator(COMPANY).fill('Acceptance Baseline GmbH');
    await expect(page.getByLabel('Company')).toHaveValue('Acceptance Baseline GmbH');

    await switchMutation(page, MutationLevel.HARD);
    await page.locator(COMPANY).fill('Acceptance Healing GmbH');
    await expect(page.getByLabel('Company')).toHaveValue('Acceptance Healing GmbH');
  });

  test('selectOption works natively at OFF and heals at HARD', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.OFF);
    await page.locator(PAYMENT).selectOption({ label: 'Invoice' });
    await expect(page.getByLabel('Payment Method')).toHaveValue(/invoice/i);

    await switchMutation(page, MutationLevel.HARD);
    await page.locator(PAYMENT).selectOption({ label: 'Bank transfer' });
    await expect(page.getByLabel('Payment Method')).toHaveValue(/bank/i);
  });

  test('check works natively at OFF and heals at HARD', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.OFF);
    await page.locator(TERMS).check();
    await expect(page.getByLabel('Accept terms')).toBeChecked();

    await switchMutation(page, MutationLevel.HARD);
    await page.locator(TERMS).check();
    await expect(page.getByLabel('Accept terms')).toBeChecked();
  });

  test('uncheck works natively at OFF and heals at HARD', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.OFF);
    await page.locator(TERMS).check();
    await page.locator(TERMS).uncheck();
    await expect(page.getByLabel('Accept terms')).not.toBeChecked();

    await switchMutation(page, MutationLevel.HARD);
    // Set the live checkbox state semantically, then deliberately execute the
    // legacy locator for the operation under test.
    await page.getByLabel('Accept terms').check();
    await page.locator(TERMS).uncheck();
    await expect(page.getByLabel('Accept terms')).not.toBeChecked();
  });

  test('press works natively at OFF and heals at HARD', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.OFF);

    // `Locator.press()` sends a key event; it does not clear an existing value.
    // Prepare the field semantically so this test measures only the press operation.
    await page.getByLabel('Company').fill('');
    await page.locator(COMPANY).press('A');
    await expect(page.getByLabel('Company')).toHaveValue('A');

    await switchMutation(page, MutationLevel.HARD);

    // Use a stable semantic locator only for test setup. The operation under test
    // deliberately uses the legacy locator and therefore has to heal at HARD.
    await page.getByLabel('Company').fill('');
    await page.locator(COMPANY).press('B');
    await expect(page.getByLabel('Company')).toHaveValue('B');
  });

  test('hover works natively at OFF and heals at HARD', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.OFF);
    await page.locator(PAY_BUTTON).hover();
    await expect(page.getByRole('button', { name: 'Start Checkout' })).toBeVisible();

    await switchMutation(page, MutationLevel.HARD);
    await page.locator(PAY_BUTTON).hover();
    await expect(page.getByRole('button', { name: 'Continue Billing Flow' })).toBeVisible();
  });

  test('dblclick works natively at OFF and heals at HARD', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.OFF);
    await page.locator(COMPANY).dblclick();
    await expect(page.getByLabel('Company')).toBeVisible();

    await switchMutation(page, MutationLevel.HARD);
    await page.locator(COMPANY).dblclick();
    await expect(page.getByLabel('Company')).toBeVisible();
  });

  test('waitFor visible works natively at OFF and heals at HARD', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.OFF);
    await page.locator(PAY_BUTTON).waitFor({ state: 'visible' });

    await switchMutation(page, MutationLevel.HARD);
    await page.locator(PAY_BUTTON).waitFor({ state: 'visible' });
    await expect(page.getByRole('button', { name: 'Continue Billing Flow' })).toBeVisible();
  });
});
