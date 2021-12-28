import { Page, test, expect, ElementHandle } from '@playwright/test';
import v8toIstanbul from 'v8-to-istanbul';
import fs from 'fs';
import path from 'path';
import type { LoadingProgressBarHTMLElement } from '../src/index';

const TAG = 'loading-progress-bar';
const ELEMENT_ID = 'loadingProgressBar';

test.describe('loading-progress-bar', () => {
  let page: Page;
  let lpbElementHandle: ElementHandle<LoadingProgressBarHTMLElement>;

  test.beforeAll(async ({ browser, browserName }) => {
    page = await browser.newPage();

    if (browserName === 'chromium') {
      await page.coverage.startJSCoverage();
    }

    await page.goto('/');
    console.log(browserName, page.url());
  });

  test.afterAll(async ({ browserName }) => {
    if (browserName === 'chromium') {
      const notCoveragePaths = /^$|(www)|(node_modules)/gi;
      let data = {};

      const coverage = await page.coverage.stopJSCoverage();

      for (const entry of coverage) {
        if (entry.source != null) {
          const converter = v8toIstanbul('', 0, { source: entry.source });
          await converter.load();
          converter.applyCoverage(entry.functions);

          // https://istanbul.js.org/docs/advanced/alternative-reporters/#json
          data = {
            ...data,
            ...converter.toIstanbul(),
          };
        }
      }

      for (const key in data) {
        const item = data[key];

        if (notCoveragePaths.test(item['path'])) {
          delete data[key];
          continue;
        }

        if (typeof item['path'] === 'string') {
          item['path'] = `${item['path'].split('?')[0]}`.replace('@web-companions/gfc/', '');
        }
      }

      const saveDir = path.join(__dirname, '../.nyc_output');

      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir);
      }

      fs.writeFileSync(path.join(saveDir, 'coverage-final.json'), JSON.stringify(data));
    }
  });

  test.beforeEach(async () => {
    await page.evaluate(
      ({ TAG, ELEMENT_ID }) => {
        const lpbElement = document.createElement(TAG);
        lpbElement.setAttribute('id', ELEMENT_ID);
        document.body.appendChild(lpbElement);

        return lpbElement;
      },
      { TAG, ELEMENT_ID }
    );

    lpbElementHandle = (await page.$(`#${ELEMENT_ID}`)) as ElementHandle<LoadingProgressBarHTMLElement>;
  });

  test.afterEach(async () => {
    await page.evaluate(
      ({ ELEMENT_ID }) => {
        document.getElementById(ELEMENT_ID)!.remove();
      },
      { TAG, ELEMENT_ID }
    );
  });

  test('should be rendered', async () => {
    expect(lpbElementHandle.asElement()).toBeDefined();
  });

  test('should be API generateProgress method', async () => {
    const firsGenerateStep = { value: 1, done: false };
    
    let currentGenerateStep = await lpbElementHandle.evaluate((node) => node.generateProgress?.next());
    expect(currentGenerateStep).toEqual(firsGenerateStep);

    currentGenerateStep = await lpbElementHandle.evaluate((node) => node.generateProgress?.next());
    expect(currentGenerateStep).toEqual({ value: 0, done: false });
  });

  test('should be API togglePause method', async () => {
    const res1 = await lpbElementHandle.evaluate((node) => node.togglePause!());
    expect(res1).toBeUndefined();

    const res2 = await lpbElementHandle.evaluate((node) => node.togglePause!(false));
    expect(res2).toBeUndefined();
  });

  test('should change animationPlayState', async () => {
    await lpbElementHandle.evaluate((node) => node.togglePause!());
    let animationPlayState = await lpbElementHandle.evaluate(
      (node) => getComputedStyle(node.shadowRoot?.querySelector('.lpb') as HTMLElement).animationPlayState
    );
    expect(animationPlayState).toBe('paused');

    await lpbElementHandle.evaluate((node) => node.togglePause!(false));
    animationPlayState = await lpbElementHandle.evaluate(
      (node) => getComputedStyle(node.shadowRoot?.querySelector('.lpb') as HTMLElement).animationPlayState
    );
    expect(animationPlayState).toBe('running');
  });

  test('should reset a component state after stopping the animation', async () => {
    await lpbElementHandle.evaluate(
      (node) =>
        (node.config = {
          duration: 0,
          stepsCount: 1,
        })
    );

    await lpbElementHandle.evaluate((node) => node.generateProgress!.next());
    const result = await lpbElementHandle.evaluate((node) => node.generateProgress!.next());

    expect(result).toStrictEqual({ value: 0, done: false });
  });

  test('should accept a new config correctly', async () => {
    await lpbElementHandle.evaluate(
      (node) =>
        (node.config = {
          duration: 100,
          stepsCount: 5,
        })
    );

    let result = await lpbElementHandle.evaluate((node) => {
      let _result: IteratorResult<any> = { value: 0 };

      for (let index = 0; index < 5; index++) {
        _result = node.generateProgress!.next();
      }

      return _result;
    });

    expect(result).toStrictEqual({ value: 5, done: false });

    result = await lpbElementHandle.evaluate((node) => node.generateProgress!.next());
    expect(result).toEqual({ value: 0, done: false });

    result = await lpbElementHandle.evaluate((node) => node.generateProgress!.return(-1));
    expect(result).toEqual({ value: -1, done: true });
  });

  test('should correct style without adoptedStyleSheets support', async () => {
    const isAdoptedStyleSheets = await lpbElementHandle.evaluate((node) => node.shadowRoot!['adoptedStyleSheets'] != null);
    let styleEl = await lpbElementHandle.evaluate((node) => node.shadowRoot!.querySelector('style'));

    expect(isAdoptedStyleSheets || styleEl != null).toBeTruthy();

    await page.evaluate(() => {
      const dNewProto = Document.prototype;
      delete dNewProto['adoptedStyleSheets'];
      Object.setPrototypeOf(Document, dNewProto);
    });

    await lpbElementHandle.evaluate((node) => {
      node.generateProgress?.next();
    });

    await lpbElementHandle.evaluate((node) => {
      node.generateProgress?.next();
    });

    styleEl = await lpbElementHandle.evaluate((node) => node.shadowRoot!.querySelector('style'));

    expect(styleEl).toBeTruthy();
  });
});
