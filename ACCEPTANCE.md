# TestZombie Playwright Acceptance Suite

This suite is the release gate for the Playwright adapter. It complements the five-level onboarding showcase with small tests that isolate one capability at a time.

## Coverage

| Area | Acceptance coverage |
| --- | --- |
| Actions | `click`, `fill`, `selectOption`, `check`, `uncheck`, `press`, `hover`, `dblclick`, `waitFor({state:'visible'})` |
| Native Playwright locators | CSS `locator`, `getByTestId`, `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, chained locators |
| Safety | true no-match must fail, negative visibility must not heal, hidden/detached absence waits stay native |
| Backend behavior | fail-open continues with native Playwright, fail-closed rejects initialization |
| Parallel isolation | 8 independent tests with unique worker tokens and HARD locator healing |
| Browsers | scripts provided for Chromium only or Chromium + Firefox + WebKit |

## Test model

For mutating action/locator tests the suite first performs the operation at `OFF`, then reloads the same page at `HARD` and deliberately reuses the original locator. No test-side fallback is added. A successful HARD operation therefore exercises the TestZombie healing path.

## Commands

```bash
npm run typecheck
npm run test:acceptance
npm run test:acceptance:all-browsers
npm run test:parallel
npm run test:release-check
```

For a visible Chromium acceptance run:

```bash
npm run test:acceptance:headed
```

## Parallel run validation

Each of the eight parallel tests writes a unique value such as:

```text
tz-worker-4-p3@testzombie.invalid
```

and logs a matching `[TestZombie][PARALLEL]` token. In addition to a green Playwright run, use those tokens to spot-check that backend run/healing logs are not cross-associated between workers.

## Release recommendation

Treat a release candidate as ready for pilot usage when:

- the five-level onboarding flow is green;
- `npm run test:acceptance:all-browsers` is green;
- `npm run test:parallel` is green with eight workers;
- the backend log spot-check shows worker/run isolation;
- no secrets or generated Playwright artifacts are present in `npm pack --dry-run` for the library package.
