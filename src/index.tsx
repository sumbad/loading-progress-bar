import { EG, useState, useEffect } from '@web-companions/fc';
import type { TypeConstructor } from '@web-companions/fc/common.model';

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

export const loadingProgressBar = EG({
  props: {
    config: {
      type: {} as TypeConstructor<LoadingProgressBarConfig>,
      default: {
        duration: 2000,
        stepsCount: 1,
      },
    },
    color: {
      type: String,
      attribute: 'color',
      default: '#ef534e',
    },
  },
  render: (t: { template: string; style: string }, c) => {
    const inner = (c as ShadowRoot).innerHTML;
    if (inner !== t.template) {
      (c as ShadowRoot).innerHTML = t.template;
    }

    const sheet = new CSSStyleSheet();
    sheet['replaceSync'](t.style);
    (c as ShadowRoot)['adoptedStyleSheets'] = [sheet];
  },
  shadow: {
    mode: 'open',
  },
})(function (this: LoadingProgressBarHTMLElement, props) {
  const [isPause, setIsPause] = useState(false);
  const [keyframes, setKeyframes] = useState();
  const [animationName, setAnimationName] = useState();
  const animationDuration = props.config.duration;

  useEffect(() => {
    const stepsCount = props.config.stepsCount;
    const k = 100 / stepsCount;

    let _keyframes = '';
    for (let i = 0; i < stepsCount; i++) {
      const keyframeName = ` loadingPB_${i * k}`;
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
    setKeyframes(_keyframes);

    let index = 0;
    const generator = function* () {
      while (true) {
        if (index < stepsCount) {
          setAnimationName(`loadingPB_${index * k}`);
          yield ++index;
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
    this.togglePause = (pause?: boolean) => setIsPause((hasPause) => (typeof pause === 'boolean' ? pause : !hasPause));
  }, [props.config]);

  return {
    style: css`
      /* dynamic keyframes */
      ${keyframes}

      .lpb {
        animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
        animation-fill-mode: both;
        background: ${props.color};
        height: 3px;
        left: 0;
        top: 0;
        width: 0%;
        z-index: 9999;
        position: fixed;
        animation-name: ${animationName};
        animation-duration: ${animationDuration + 'ms'};
        animation-play-state: ${isPause ? 'paused' : 'running'};
      }

      .lpb:after {
        display: ${animationName !== undefined ? 'block' : 'none'};
        position: absolute;
        content: '';
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: ${`0 0 10px ${props.color}, 0 0 5px ${props.color}`};
        opacity: 1;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `,
    template: <div class="lpb"></div>,
  };
});
