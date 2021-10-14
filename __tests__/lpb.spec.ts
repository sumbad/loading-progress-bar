import { loadingProgressBar, LoadingProgressBarHTMLElement } from '../src/index';

// const sleep = new Promise()

describe('loading-progress-bar', () => {
  const TAG = 'loading-progress-bar';
  const ELEMENT_ID = 'loadingProgressBar';
  let lpbElement: HTMLElement;

  loadingProgressBar('loading-progress-bar');

  function getElement() {
    return document.body.getElementsByTagName(TAG)[0] as LoadingProgressBarHTMLElement;
  }

  beforeEach(() => {
    lpbElement = window.document.createElement(TAG);
    lpbElement.setAttribute('id', ELEMENT_ID);
    document.body.appendChild(lpbElement);
  });

  afterEach(() => {
    document.body.getElementsByTagName(TAG)[0].remove();
  });

  it('should be rendered "loading-progress-bar"', async () => {
    const el = getElement();

    expect(el).toBeDefined();
  });

  it('should be API generateProgress method', async () => {
    const el = getElement();

    const firsGenerateStep = { value: 1, done: false };
    const currentGenerateStep = el.generateProgress.next();
    expect(currentGenerateStep).toEqual(firsGenerateStep);
  });

  it('should be API togglePause method', async () => {
    const el = getElement();

    expect(el.togglePause()).toBeUndefined();
    expect(el.togglePause(false)).toBeUndefined();
  });

  it('should change animationPlayState', async () => {
    const el = getElement();
    const childEl = el.shadowRoot.firstChild as HTMLElement;

    el.togglePause();
    await Promise.resolve();
    expect(getComputedStyle(childEl).animationPlayState).toBe('paused');

    el.togglePause(false);
    await Promise.resolve();
    expect(getComputedStyle(childEl).animationPlayState).toBe('running');
  });

  it('should reset a component state after stopping the animation', async () => {
    const el = getElement();
    el.config = {
      duration: 0,
      stepsCount: 1,
    };

    el.generateProgress.next();
    const result = el.generateProgress.next();

    expect(result).toStrictEqual({ value: 0, done: false });
  });
});
