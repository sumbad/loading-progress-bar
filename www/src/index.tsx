import { EG } from '@web-companions/gfc';
import { loadingProgressBar } from '../../src';
import { render as uhtmlRender } from 'uhtml';

const render = (t, c) => uhtmlRender(c, t);

const css = String.raw;

const LoadingProgressBar = loadingProgressBar('loading-progress-bar');

/**
 * ROOT element
 */
EG()(function* () {
  const myRef: {
    current: {
      generateProgress?: Generator;
      togglePause: (isPause?: boolean) => void;
    } | null;
  } = {
    current: null,
  };

  let loaderConfig = {
    duration: 2000,
    stepsCount: 1,
  };

  let color = '#ef534e';
  let colorInterval: NodeJS.Timeout | null = null;

  let hasCustomPause = false;

  const handleProgress = () => {
    hasCustomPause = false;
    console.log(myRef.current);

    if (myRef.current?.generateProgress !== undefined) {
      const r = myRef.current.generateProgress.next();
      if (r.value === 1) {
        setTimeout(() => {
          !hasCustomPause && myRef.current?.togglePause(true);
        }, 300);
        setTimeout(() => {
          !hasCustomPause && myRef.current?.togglePause(false);
        }, 1000);
        setTimeout(() => {
          !hasCustomPause && myRef.current?.togglePause(true);
        }, 2000);
        setTimeout(() => {
          !hasCustomPause && myRef.current?.togglePause(false);
        }, 3000);
      }
      console.log(JSON.stringify(r));
    }
  };

  const handleColor = (e: InputEvent) => {
    console.log((e.target as HTMLInputElement).value);
    color = (e.target as HTMLInputElement).value;
    this.next();
  };

  const randomizeColor = () => {
    if (colorInterval != null) {
      clearInterval(colorInterval);
      colorInterval = null;
    } else {
      colorInterval = setInterval(() => {
        const letters = '0123456789ABCDEF';
        let _color = '#';
        for (let i = 0; i < 6; i++) {
          _color += letters[Math.floor(Math.random() * 16)];
        }
        color = _color;
        this.next();
      }, 700);
    }
  };

  while (true) {
    yield render(
      <>
        <style>
          {css`
            .item {
              margin: 10px;
              display: block;
            }
          `}
        </style>

        <LoadingProgressBar
          color={color}
          config={loaderConfig}
          ref={myRef}
          style={css`
            margin: 30px;
          `}
        ></LoadingProgressBar>

        <button onclick={handleProgress} class="item">
          Progress/Reset loading
        </button>

        <button
          onclick={() => {
            myRef.current?.togglePause();
            hasCustomPause = true;
          }}
          class="item"
        >
          Pause/Run
        </button>

        <section class="item">
          <span
            for="colorField"
            style={css`
              color: white;
              font-weight: bold;
            `}
          >
            Color:
          </span>
          <input id="colorField" onchange={handleColor} type="text" value={color}></input>
          <button onclick={randomizeColor} class="item">
            Randomize color
          </button>
        </section>

        <textarea
          class="item"
          rows="10"
          value={JSON.stringify(loaderConfig, null, 2)}
          onchange={(e: Event) => {
            loaderConfig = JSON.parse((e.currentTarget as HTMLTextAreaElement).value);
            this.next();
          }}
        ></textarea>
      </>,
      this
    );
  }
})('demo-app');
