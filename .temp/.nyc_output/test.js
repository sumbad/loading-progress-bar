import { E as EG, u as useState, a as useEffect } from './vendors-0bbe062a.js';

const html = String.raw;
const css = String.raw;
const loadingProgressBar = EG({
  config: {
    init: {
      duration: 2000,
      stepsCount: 1
    }
  }
}, function (props) {
  const [isPause, setIsPause] = useState(false);
  const [keyframes, setKeyframes] = useState();
  const [animationName, setAnimationName] = useState();
  useEffect(() => {
    const k = 100 / props.config.stepsCount;
    let _keyframes = '';

    for (let i = 0; i < props.config.stepsCount; i++) {
      const keyframeName = ` loadingPB_${i * k}`;
      _keyframes = _keyframes + ' ' + css`
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
        if (index < props.config.stepsCount) {
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

    this.togglePause = pause => setIsPause(hasPause => typeof pause === 'boolean' ? pause : !hasPause);
  }, [props.config]);
  return {
    style: css`
        /* dynamic keyframes */
        ${keyframes}

        .lpb {
          animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
          animation-fill-mode: both;
          background: #ef534e;
          height: 3px;
          left: 0;
          top: 0;
          width: 0%;
          z-index: 9999;
          position: fixed;
          animation-name: ${animationName};
          animation-duration: ${props.config.duration + 'ms'};
          animation-play-state: ${isPause ? 'paused' : 'running'};
        }

        .lpb:after {
          display: block;
          position: absolute;
          content: '';
          right: 0px;
          width: 100px;
          height: 100%;
          /* box-shadow: #ef534e 1px 0 6px 1px; */
          opacity: 0.5;
        }
      `,
    template: html`<div class="lpb"></div>`
  };
}, {
  render: (c, t) => {
    const inner = c.innerHTML;

    if (inner !== t.template) {
      c.innerHTML = t.template;
    }

    const sheet = new CSSStyleSheet();
    sheet['replaceSync'](t.style);
    c['adoptedStyleSheets'] = [sheet];
  },
  shadow: {
    mode: 'open'
  }
});

loadingProgressBar.define('loading-progress-bar');
//# sourceMappingURL=test.js.map
