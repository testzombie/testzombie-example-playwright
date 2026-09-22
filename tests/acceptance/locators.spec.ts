import type { Page } from '../../src/support/framework.js';
import { MutationLevel } from '../../src/support/mutation-level.js';
import { expect, test } from '../test.js';
import { openAtMutation, switchMutation } from './helpers.js';

async function primeBaselineAndGoHard(
  page: Page,
  prime: () => Promise<unknown>,
): Promise<void> {
  await openAtMutation(page, '/checkout.html', MutationLevel.OFF);
  await prime();
  await switchMutation(page, MutationLevel.HARD);
}

test.describe('Playwright-native locator acceptance', () => {
  test('page.locator CSS participates in healing', async ({ page }) => {
    const selector = 'input[data-testid="company-input"]';
    await primeBaselineAndGoHard(page, async () => page.locator(selector).waitFor({ state: 'visible' }));

    await page.locator(selector).fill('CSS Locator GmbH');
    await expect(page.getByLabel('Company')).toHaveValue('CSS Locator GmbH');
  });

  test('getByTestId participates in healing when data-testid mutates', async ({ page }) => {
    await primeBaselineAndGoHard(page, async () => page.getByTestId('company-input').waitFor({ state: 'visible' }));

    await page.getByTestId('company-input').fill('TestId Locator GmbH');
    await expect(page.getByLabel('Company')).toHaveValue('TestId Locator GmbH');
  });

  test('getByRole can heal an old accessible name', async ({ page }) => {
    await primeBaselineAndGoHard(page, async () => {
      await page.getByRole('button', { name: 'Start Checkout', exact: true }).waitFor({ state: 'visible' });
    });

    await page.getByRole('button', { name: 'Start Checkout', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Continue Billing Flow' })).toBeVisible();
  });

  test('getByLabel works through the wrapped page', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.HARD);

    await page.getByLabel('Company').fill('Label Locator GmbH');
    await expect(page.getByLabel('Company')).toHaveValue('Label Locator GmbH');
  });

  test('getByPlaceholder works through the wrapped page', async ({ page }) => {
    await openAtMutation(page, '/checkout.html', MutationLevel.HARD);

    await page.getByPlaceholder('EU123456789').fill('EU999999999');
    await expect(page.getByLabel('VAT ID')).toHaveValue('EU999999999');
  });

  test('getByText can heal old visible text', async ({ page }) => {
    await primeBaselineAndGoHard(page, async () => {
      await page.getByText('Start Checkout', { exact: true }).waitFor({ state: 'visible' });
    });

    await page.getByText('Start Checkout', { exact: true }).waitFor({ state: 'visible' });
    await expect(page.getByRole('button', { name: 'Continue Billing Flow' })).toBeVisible();
  });

  test('chained locators preserve healing context', async ({ page }) => {
    const chained = () => page.locator('form.form').locator('input[data-testid="company-input"]');

    await openAtMutation(page, '/checkout.html', MutationLevel.OFF);
    await chained().waitFor({ state: 'visible' });
    await switchMutation(page, MutationLevel.HARD);

    await chained().fill('Chained Locator GmbH');
    await expect(page.getByLabel('Company')).toHaveValue('Chained Locator GmbH');
  });
});
