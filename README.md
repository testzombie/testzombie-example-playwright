# TestZombie Playwright Demo

Separates Beispiel- und Acceptance-Projekt für `@testzombie/playwright`.
Die TestZombie-Library ist **nicht** in diesem Repository eingebettet. Sie wird normal über npm installiert.

## Voraussetzungen

- Node.js 20+
- npm
- Zugriff auf `http://demoweb2.testzombie.ai`
- TestZombie API-Key und E-Mail
- veröffentlichte npm-Version `@testzombie/playwright@0.2.0-beta.1`

## Installation

```bash
npm install
npx playwright install
```

Nur Chromium:

```bash
npx playwright install chromium
```

Die `package.json` referenziert direkt:

```json
"@testzombie/playwright": "0.2.0-beta.1"
```

Sobald eine neuere Beta getestet werden soll, kann alternativ installiert werden mit:

```bash
npm install -D @testzombie/playwright@beta
```

## Credentials

Am besten lokal über Environment Variables oder eine nicht eingecheckte `.env`-Datei setzen.
Die Beispielwerte stehen in `.env.example`.

PowerShell:

```powershell
$env:TESTZOMBIE_API_KEY="..."
$env:TESTZOMBIE_EMAIL="..."
```

Linux/macOS:

```bash
export TESTZOMBIE_API_KEY="..."
export TESTZOMBIE_EMAIL="..."
```

Optional:

```bash
export TESTZOMBIE_API_URL="https://testzombie.ai/api/"
```

## Integration

Der zentrale Import liegt in `src/support/framework.ts`:

```ts
export { expect, test } from '@testzombie/playwright';
export type { Locator, Page, TestInfo } from '@playwright/test';
```

Die Page Objects und Tests benötigen dadurch keinen TestZombie-spezifischen Code.

## Demo-Flow

Der vollständige Onboarding-Flow läuft über fünf Mutation Levels:

```text
OFF
LIGHT
REALISTIC
HARD
EXTREME
```

Chromium:

```bash
npm test
```

Sichtbar:

```bash
npm run test:headed
```

Einzelne Browser:

```bash
npm run test:firefox
npm run test:webkit
```

Alle drei Browser:

```bash
npm run test:all-browsers
```

Nur stabile Baseline (`OFF`):

```bash
npm run test:baseline
```

## Acceptance Suite

Isolierte Tests für Actions, Locator-Typen und Failure-Safety:

```bash
npm run test:acceptance
```

Alle Browser:

```bash
npm run test:acceptance:all-browsers
```

8 Worker / Parallel-Isolation:

```bash
npm run test:parallel
```

Kompletter Release-Check:

```bash
npm run test:release-check
```

## Projektstruktur

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

## Wichtig

Das Projekt enthält bewusst **keine Locator-Fallbacks im Testcode**. Der jeweils ursprüngliche Locator soll bei DOM-Mutationen durch TestZombie geheilt werden.

Es enthält außerdem **kein lokales npm-Tarball** der TestZombie-Library. Die Demo bleibt damit unabhängig von der Library-Quelle und testet denselben Installationsweg wie ein späterer Kunde.
