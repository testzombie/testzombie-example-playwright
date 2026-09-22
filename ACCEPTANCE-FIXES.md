# Acceptance suite fixes

This revision keeps `@testzombie/playwright` at **0.1.5**. The changes are in the acceptance tests only.

## `press()`

`Locator.press('A')` does not clear an input's existing value. The previous test incorrectly expected the pre-populated Company field to become exactly `A`/`B`. The test now clears the field with a stable semantic locator as setup, then executes the legacy locator only for the `press()` operation being tested.

## Truly missing element

The previous negative test ran on the full mutated checkout page. With AI healing enabled, that page contains many plausible interactive candidates, so it is not a deterministic environment for proving that *no* element exists. The test now replaces the document with a minimal non-interactive page and explicitly verifies that the missing locator throws `Element could not be healed or found`.
