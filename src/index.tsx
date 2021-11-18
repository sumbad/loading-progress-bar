import { EG, p } from '@web-companions/gfc';

const html = String.raw;
const css = String.raw;

export interface LoadingProgressBarConfig {
  stepsCount: number; // (1 by default)
  duration: number; // ms (2000ms by default)
}

export interface LoadingProgressBarHTMLElement extends HTMLElement {
  generateProgress?: Generator;
  togglePause?: (isPause?: boolean) => void;
  ref?: { current?: any };
  config?: LoadingProgressBarConfig;
}

function render(t: { template: string; style: string }, c: ShadowRoot) {
  let el = c.querySelector('div');

  if (el == null) {
    el = document.createElement('div');
    el.style.display = 'contents';
    el.innerHTML = t.template;
    c.append(el);
  }

  if (window.ShadowRoot && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype) {
    const sheet = new CSSStyleSheet();
    sheet['replaceSync'](t.style);
    c['adoptedStyleSheets'] = [sheet];
  } else {
    let style = c.querySelector('style');
    if (style == null) {
      style = document.createElement('style');
      style.innerHTML = t.style;
      c.insertBefore(style, el);
    } else {
      style.innerHTML = t.style;
    }
  }
}

/**
 * Loading Progress Bar element
 * 
 * @param config - LoadingProgressBarConfig (optional)
 * @param color - the main color (optional, #ef534e by default)
 */
export const loadingProgressBar = EG({
  props: {
    config: p.opt<LoadingProgressBarConfig>(),
    color: p.opt<string>('color'),
  },
})(function* (this: LoadingProgressBarHTMLElement & { next(): Promise<void> }, props) {
  const $ = this.attachShadow({ mode: 'open' });

  let config = props.config || {
    duration: 2000,
    stepsCount: 1,
  };
  let color = props.color || '#ef534e';
  ///////////////////////////////////////

  let isPause = false;
  let keyframes: string = '';
  let animationName: string | undefined;

  const setAnimationName = (value: string | undefined) => {
    animationName = value;
    this.next();
  };

  const setIsPause = (value: boolean) => {
    isPause = value;
    this.next();
  };

  const updateStepsCount = (stepsCount: number) => {
    const k = 100 / stepsCount;

    let _keyframes = '';
    for (let i = 0; i < stepsCount; i++) {
      const keyframeName = ` loadingPB_${i}`;
      _keyframes =
        _keyframes +
        ' ' +
        css`
          /* clean-css ignore:start */
          @keyframes ${keyframeName} {
            from {
              width: ${i * k + '%'};
            }
            to {
              width: ${(i + 1) * k + '%'};
            }
          }
          /* clean-css ignore:end */
        `;
    }
    keyframes = _keyframes;

    let index = 0;
    const generator = function* () {
      while (true) {
        if (index < stepsCount) {
          setAnimationName(`loadingPB_${index}`);
          ++index;
          yield index;
        } else {
          setIsPause(false);
          setAnimationName(undefined);
          index = 0;
          yield index;
        }
      }
    };

    this.ref = this.ref || {};
    this.ref.current = this;
    this.generateProgress = generator();
    this.togglePause = (pause?: boolean) => setIsPause(typeof pause === 'boolean' ? pause : !isPause);
  };

  updateStepsCount(config.stepsCount);

  while (true) {
    color = props.color || color;

    if (props.config?.stepsCount != null && props.config.stepsCount !== config.stepsCount) {
      config.stepsCount = props.config.stepsCount;
      updateStepsCount(config.stepsCount);
    }

    if (props.config?.duration != null && props.config.duration !== config.duration) {
      config.duration = props.config.duration;
    }

    props = yield render(
      {
        style: css`
          /* dynamic keyframes */
          ${keyframes}

          .lpb {
            animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            animation-fill-mode: both;
            background: ${color};
            height: 3px;
            left: 0;
            top: 0;
            width: 0%;
            z-index: 9999;
            position: fixed;
            animation-name: ${animationName};
            animation-duration: ${config.duration + 'ms'};
            animation-play-state: ${isPause ? 'paused' : 'running'};
          }

          .lpb:after {
            display: ${animationName !== undefined ? 'block' : 'none'};
            position: absolute;
            content: '';
            right: 0px;
            width: 100px;
            height: 100%;
            box-shadow: ${`0 0 10px ${color}, 0 0 5px ${color}`};
            opacity: 1;
            transform: rotate(3deg) translate(0px, -4px);
          }
        `,
        template: <div class="lpb"></div>,
      },
      $
    );
  }
});
