export class DemoLogger {
  private static stepCounter = 0;
  private static startedAt = 0;

  static startTest(testName: string, baseUrl: string, browser: string, headless: boolean): void {
    this.stepCounter = 0;
    this.startedAt = Date.now();
    this.line();
    console.log(' TestZombie Playwright Demo');
    this.line();
    this.info('TEST', testName);
    this.info('URL', baseUrl);
    this.info('BROWSER', `${browser}${headless ? ' (headless)' : ' (visible)'}`);
    this.line();
  }

  static step(description: string): void {
    this.stepCounter += 1;
    console.log(`\n[${this.timestamp()}] STEP ${String(this.stepCounter).padStart(2, '0')}  ${description}`);
  }

  static action(action: string, locator: string, value?: string): void {
    const valueSuffix = value === undefined ? '' : ` | value=${value}`;
    console.log(`[${this.timestamp()}] ACTION   ${action.padEnd(12)} ${locator}${valueSuffix}`);
  }

  static navigation(target: string): void {
    console.log(`[${this.timestamp()}] NAVIGATE ${target}`);
  }

  static pass(message: string): void {
    console.log(`[${this.timestamp()}] PASS     ${message}`);
  }

  static verify(description: string, expected: unknown, actual: unknown): void {
    console.log(`[${this.timestamp()}] VERIFY   ${description} | expected=${String(expected)} | actual=${String(actual)}`);
  }

  static info(label: string, value: unknown): void {
    console.log(`[${this.timestamp()}] ${label.padEnd(8)} ${String(value)}`);
  }

  static failure(message: string, error: unknown): void {
    let detail: string;
    if (error instanceof Error) {
      detail = `${error.name}: ${error.message}`;
    } else if (error && typeof error === 'object') {
      const serialized = error as { name?: unknown; message?: unknown; value?: unknown; stack?: unknown };
      const name = typeof serialized.name === 'string' ? serialized.name : 'Error';
      const text = typeof serialized.message === 'string'
        ? serialized.message
        : typeof serialized.value === 'string'
          ? serialized.value
          : JSON.stringify(error);
      detail = `${name}: ${text}`;
    } else {
      detail = String(error);
    }
    console.log(`[${this.timestamp()}] FAIL     ${message} | ${detail}`);
  }

  static finish(success: boolean): void {
    const millis = this.startedAt === 0 ? 0 : Date.now() - this.startedAt;
    this.line();
    console.log(` RESULT: ${success ? 'SUCCESS' : 'FAILED'} | duration=${(millis / 1000).toFixed(2)} s`);
    this.line();
  }

  private static timestamp(): string {
    const now = new Date();
    return now.toLocaleTimeString('de-DE', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  }

  private static line(): void {
    console.log('============================================================');
  }
}
