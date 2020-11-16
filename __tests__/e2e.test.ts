import pti from 'puppeteer-to-istanbul';

describe('localhost', () => {
  beforeAll(async () => {
    // Enable both JavaScript and CSS coverage
    await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);

    await page.goto('http://localhost:8082');
  });

  afterAll(async () => {
    // Disable both JavaScript and CSS coverage
    let [jsCoverage, cssCoverage] = await Promise.all([page.coverage.stopJSCoverage(), page.coverage.stopCSSCoverage()]);
    // coverage only the component code
    jsCoverage = jsCoverage.filter(({ url }) => url.includes('test'));
    // jsCoverage.forEach((...r) => console.log(r));

    let totalBytes = 0;
    let usedBytes = 0;
    const coverage = [...jsCoverage, ...cssCoverage];
    for (const entry of coverage) {
      totalBytes += entry.text.length;
      for (const range of entry.ranges) usedBytes += range.end - range.start - 1;
    }
    console.log(`Bytes used: ${(usedBytes / totalBytes) * 100}%`);
    // NOTE: https://github.com/istanbuljs/puppeteer-to-istanbul/issues/18
    pti.write([...jsCoverage, ...cssCoverage], { includeHostname: false, storagePath: './.temp/.nyc_output' });
  });

  it('should be titled "Test"', async () => {
    await expect(page.title()).resolves.toMatch('Test');
  });

  it('should be rendered "loading-progress-bar"', async () => {
    await expect(page).toMatchElement('loading-progress-bar');
  });

  it('should be API generateProgress', async () => {
    const firsGenerateStep = { value: 1, done: false };
    const currentGenerateStep = await page.$eval('loading-progress-bar', e => e['generateProgress'].next());
    expect(currentGenerateStep).toEqual(firsGenerateStep);
  });

  it('should be API togglePause', async () => {
    await expect(page.$eval('loading-progress-bar', e => e['togglePause']())).resolves.toBeUndefined();
    await expect(page.$eval('loading-progress-bar', e => e['togglePause'](false))).resolves.toBeUndefined();
  });
});
