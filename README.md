# TestZombie Playwright Example

A small Playwright project that demonstrates **TestZombie Self-Healing**, **Discovery** and optional **Persistent Healing** with `@testzombie/playwright`.

The example intentionally uses normal Playwright tests and Page Objects. There are no TestZombie-specific fallback locators in the test code.

## Quick start — 1, 2, 3

### 1. Install

Clone the project and install the dependencies:

```bash
npm install
npx playwright install chromium
```

The example uses the stable `1.x` line of:

```text
@testzombie/playwright
```

In an existing Playwright project, install TestZombie with:

```bash
npm install -D @testzombie/playwright
```

### 2. Configure TestZombie

Set your TestZombie API key and account e-mail before starting the tests. You can create an account at `testzombie.ai`.

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

Optional variables are documented in `.env.example`.

### 3. Run the Self-Healing demo

Run the complete five-level onboarding flow in Chromium:

```bash
npm test
```

To watch the browser:

```bash
npm run test:headed
```

The same business flow runs through:

```text
OFF → LIGHT → REALISTIC → HARD → EXTREME
```

At higher mutation levels the original locators become invalid. TestZombie attempts to identify the correct element and continues the Playwright action with the healed locator.

---

## Discovery — learn a working business flow

Self-Healing fixes broken locators. **Discovery has a different job:** it observes a successful test flow and collects useful context about what happened.

Run the dedicated Discovery example with:

```bash
npm run test:discovery
```

The example executes one stable onboarding flow on **Mutation Level 0 / OFF**.

That is intentional: nothing should be broken or healed in this scenario. We want TestZombie to see how the application works when the business flow succeeds normally.

### What happens during Discovery?

In simple terms:

```text
Existing Playwright test
        ↓
successful user flow
        ↓
TestZombie Discovery
        ↓
pages + elements + interactions + context
        ↓
AI Test Design
        ↓
business test cases
        ↓
selected test cases
        ↓
automation code
```

While the test runs, TestZombie collects context such as the visited pages, relevant UI elements, interactions and the order in which the flow happens.

This information gives AI Test Design more than just a URL or a screenshot. It provides context from a **real working user journey**. TestZombie can use that context to derive meaningful business test cases. Selected test cases can later be used as the basis for generated automation code.

The Discovery example is in:

```text
tests/discovery-level0.spec.ts
```

The important part is deliberately small:

```ts
import { TestZombie } from '@testzombie/playwright';

TestZombie.configure({
  discoveryEnabled: true,
  discoveryFileEnabled: true,
  discoveryFilePath: 'test-results/testzombie-discovery-{testRunId}.json',
});
```

The test itself remains normal Playwright/Page-Object code.

For transparency, the example also writes the collected Discovery payload to:

```text
test-results/testzombie-discovery-<testRunId>.json
```

This local file is useful for understanding what was collected. The normal TestZombie integration handles the backend communication.

### Why Mutation Level 0?

The regular demo intentionally breaks locators to demonstrate Self-Healing.

The Discovery demo does the opposite: it uses the stable baseline so the collected data describes a valid, successful business process.

That makes the roles easy to distinguish:

```text
Discovery     → understand the working flow
Self-Healing  → keep the automated flow running when locators change
```

---

## Code Update — heal Level 1 and update the source

Discovery learns a working flow. The **Code Update** example demonstrates the next maintenance step: what happens when the application changes and an existing Playwright locator no longer matches.

Run the dedicated example with:

```bash
npm run test:codeupdate
```

This test runs the same onboarding journey on **Mutation Level 1 / LIGHT** and enables Persistent Healing in `apply` mode only for this scenario.

### What should happen?

In simple terms:

```text
Existing Playwright test
        ↓
Mutation Level 1 changes the UI / locators
        ↓
original locator no longer works
        ↓
TestZombie heals the element at runtime
        ↓
action succeeds with the healed locator
        ↓
Code Update writes the working locator back to the Page Object
```

The important point is that the test code does **not** contain manual fallback locators. TestZombie first proves that the healed locator really works and only then persists the successful update.

The dedicated example is in:

```text
tests/codeupdate-level1.spec.ts
```

It enables Code Update explicitly:

```ts
import { TestZombie } from '@testzombie/playwright';

TestZombie.configure({
  sourceUpdateMode: 'apply',
  sourceUpdateRoot: process.cwd(),
  discoveryEnabled: false,
});
```

After the test completes, inspect the changed Page Object selectors with:

```bash
git diff src/pages
```

For example, an immutable selector constant can be changed from the old locator to the successfully healed locator while the actual Page Object action remains untouched.

To reset the demo and run it again from the original state:

```bash
git restore src/pages
```

This keeps the two examples intentionally separate:

```text
Discovery Level 0   → learn a valid business flow
Code Update Level 1 → heal a changed UI and persist the working locator
```

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

---

## Optional: Persistent Healing modes

The dedicated `npm run test:codeupdate` scenario above enables `apply` only for that one Level-1 demonstration. In other tests, source-code updates remain **optional** and can also be controlled through environment variables.

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

---

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm test` | Complete five-level onboarding flow in Chromium |
| `npm run test:discovery` | Stable Level-0 flow with Discovery enabled |
| `npm run test:codeupdate` | Level-1 onboarding with runtime healing + source-code update |
| `npm run test:headed` | Chromium with visible browser |
| `npm run test:baseline` | Only the OFF baseline |
| `npm run test:firefox` | Onboarding flow in Firefox |
| `npm run test:webkit` | Onboarding flow in WebKit |
| `npm run test:all-browsers` | Onboarding flow in all three browsers |
| `npm run test:acceptance` | Acceptance suite in Chromium |
| `npm run test:acceptance:all-browsers` | Acceptance suite in all three browsers |
| `npm run test:parallel` | Parallel-isolation suite with 8 workers |
| `npm run test:release-check` | Typecheck + browser acceptance + parallel test |
| `npm run update:testzombie` | Update `@testzombie/playwright` within the compatible `1.x` range |

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
├── codeupdate-level1.spec.ts
├── discovery-level0.spec.ts
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
