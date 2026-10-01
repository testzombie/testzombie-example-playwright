# Repository role

This repository is the standalone consumer/demo project for `@testzombie/playwright`.

It intentionally consumes the library from npm exactly like a customer project.

Do not commit:

- `packages/*.tgz`
- the TestZombie Playwright library source
- `node_modules`
- `.env` files or credentials
- Playwright reports, traces, screenshots, videos or test-results

The repository itself is marked `private: true` in `package.json` so it cannot be published to npm accidentally.
