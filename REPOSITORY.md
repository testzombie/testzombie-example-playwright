# Repository role

This repository is the standalone consumer/demo project for `@testzombie/playwright`.

It demonstrates Self-Healing, Discovery and Persistent Healing / Code Update using the same npm package and Playwright APIs a customer project would use.

The two focused feature demos are intentionally separate:

- `npm run test:discovery` observes a stable Level-0 business flow.
- `npm run test:codeupdate` heals a Level-1 flow and persists successful locator updates back into the Page Objects.

It intentionally consumes the library from npm exactly like a customer project.

Do not commit:

- `packages/*.tgz`
- the TestZombie Playwright library source
- `node_modules`
- `.env` files or credentials
- Playwright reports, traces, screenshots, videos or test-results

The repository itself is marked `private: true` in `package.json` so it cannot be published to npm accidentally.
