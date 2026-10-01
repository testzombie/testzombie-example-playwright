# TestZombie Playwright Example

A small Playwright project that demonstrates **TestZombie Self-Healing** and optional **Persistent Healing** with `@testzombie/playwright`.

The example intentionally uses normal Playwright tests and Page Objects. There are no TestZombie-specific fallback locators in the test code.

## Quick start — 1, 2, 3

### 1. Install

Clone the project and install the dependencies:

```bash
npm install
npx playwright install chromium
```

The example currently uses:

```text
@testzombie/playwright@1.0.0-rc.1
```

In an existing Playwright project, TestZombie is installed with:

```bash
npm install -D @testzombie/playwright
```

### 2. Configure TestZombie

Set your TestZombie API key and account e-mail before starting the tests. Register free account on testzombie.ai

**Windows CMD**

```cmd
set TESTZOMBIE_API_KEY=your-api-key
set TESTZOMBIE_EMAIL=you@example.com
```

**PowerShell**

```powershell
$env:TESTZOMBIE_API_KEY="your-api-key"
$env:TESTZOMBIE_EMAIL="you@example.com"
```

**Linux / macOS**

```bash
export TESTZOMBIE_API_KEY="your-api-key"
export TESTZOMBIE_EMAIL="you@example.com"
```

**direct Playwright Config in playwright.config.ts**
```bash
add variables directly to try
process.env.TESTZOMBIE_API_KEY = '';
process.env.TESTZOMBIE_EMAIL = '';
// add successfull healings directly to the code 
process.env.TESTZOMBIE_SOURCE_UPDATE_MODE = 'apply';
```



Optional variables are documented in `.env.example`.

### 3. Run the demo

Run the complete five-level onboarding flow in Chromium:

```bash
npm test
```

To watch the browser:

```bash
npm run test:headed
```

The demo runs the same business flow through:

```text
OFF → LIGHT → REALISTIC → HARD → EXTREME
```

At higher mutation levels the original locators become invalid. TestZombie attempts to identify the correct element and continues the Playwright action with the healed locator.

---

## How TestZombie is integrated

The central integration is intentionally small.

Normal Playwright:

```ts
import { test, expect } from '@playwright/test';
```

With TestZombie:

```ts
import { test, expect } from '@testzombie/playwright';
```

This example centralizes that import in `src/support/framework.ts`:

```ts
export { expect, test } from '@testzombie/playwright';
export type { Locator, Page, TestInfo } from '@playwright/test';
```

Existing Page Objects and tests can otherwise keep using normal Playwright APIs.

## Optional: Persistent Healing / code updates

Runtime healing is enabled by using the TestZombie `test` fixture. Source-code updates are **optional**.

### Preview changes without modifying files

**Windows CMD**

```cmd
set TESTZOMBIE_SOURCE_UPDATE_MODE=preview
npm test
```

**PowerShell**

```powershell
$env:TESTZOMBIE_SOURCE_UPDATE_MODE="preview"
npm test
```

TestZombie reports the source update it would apply, but leaves the files unchanged.

### Apply successful healings to source code

**Windows CMD**

```cmd
set TESTZOMBIE_SOURCE_UPDATE_MODE=apply
npm test
```

**PowerShell**

```powershell
$env:TESTZOMBIE_SOURCE_UPDATE_MODE="apply"
npm test
```

After the run, inspect the changes with:

```bash
git diff
```

For the first Persistent-Healing run, keep the project at one worker. This example already uses `workers: 1` by default.

### Page Object constants are supported

The example can use normal immutable Page Object selectors:

```ts
private static readonly SAVE_BILLING = '#payButton';

async saveBilling(): Promise<void> {
  await this.click(CheckoutPage.SAVE_BILLING);
}
```

If TestZombie successfully heals `#payButton`, Persistent Healing can update the selector declaration while leaving the action call unchanged:

```ts
// TestZombie original locator [...] - healed at ...
// private static readonly SAVE_BILLING = '#payButton';
private static readonly SAVE_BILLING = '[data-automation-id="pay-healed"]';
```

Mutable `let` / `var` selectors are intentionally not rewritten.

To disable source updates again:

**Windows CMD**

```cmd
set TESTZOMBIE_SOURCE_UPDATE_MODE=off
```

**PowerShell**

```powershell
$env:TESTZOMBIE_SOURCE_UPDATE_MODE="off"
```

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm test` | Complete onboarding flow in Chromium |
| `npm run test:headed` | Chromium with visible browser |
| `npm run test:baseline` | Only the OFF baseline |
| `npm run test:firefox` | Onboarding flow in Firefox |
| `npm run test:webkit` | Onboarding flow in WebKit |
| `npm run test:all-browsers` | Onboarding flow in all three browsers |
| `npm run test:acceptance` | Acceptance suite in Chromium |
| `npm run test:acceptance:all-browsers` | Acceptance suite in all three browsers |
| `npm run test:parallel` | Parallel-isolation suite with 8 workers |
| `npm run test:release-check` | Typecheck + browser acceptance + parallel test |

## Project structure

```text
src/
├── pages/
│   ├── admin-page.ts
│   ├── base-page.ts
│   ├── checkout-page.ts
│   └── project-page.ts
└── support/
    ├── demo-logger.ts
    ├── framework.ts
    ├── mutation-level.ts
    └── playwright-actions.ts

tests/
├── acceptance/
│   ├── actions.spec.ts
│   ├── failures.spec.ts
│   ├── helpers.ts
│   ├── locators.spec.ts
│   └── parallel.spec.ts
├── onboarding-flow.spec.ts
└── test.ts
```

## Browser support

The project contains Playwright projects for:

- Chromium
- Firefox
- WebKit

Install all browsers with:

```bash
npx playwright install
```

## Security

Never commit `TESTZOMBIE_API_KEY`, account credentials or browser session data. Use environment variables or your CI/CD secret store.

The checked-in `.env.example` contains variable names only; this project does not load `.env` automatically.

## More validation

`ACCEPTANCE.md` describes the isolated action, locator, failure-safety and parallel-isolation coverage used for the adapter release checks.
