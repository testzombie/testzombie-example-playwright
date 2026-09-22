import { defineConfig, devices } from '@playwright/test';

const baseURL = (process.env.BASE_URL ?? 'http://demoweb2.testzombie.ai').replace(/\/$/, '');
const headless = process.env.HEADLESS
  ? process.env.HEADLESS.toLowerCase() === 'true'
  : Boolean(process.env.CI);
const retries = Number.parseInt(process.env.PLAYWRIGHT_RETRIES ?? '0', 10);

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: {
    timeout: 12_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: Number.isFinite(retries) ? retries : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    headless,
    actionTimeout: 12_000,
    navigationTimeout: 20_000,
    viewport: { width: 1440, height: 1100 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: 'test-results',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1100 } },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 1100 } },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 1100 } },
    },
  ],
});
