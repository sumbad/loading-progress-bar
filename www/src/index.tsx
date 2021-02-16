import { EG, useRef, useCallback, useState } from '@web-companions/fc';
import { loadingProgressBar } from '../../src';
import { render as uhtmlRender } from 'uhtml';

const css = String.raw;

const LoadingProgressBar = loadingProgressBar('loading-progress-bar');

/**
 * ROOT element
 */
EG({ render: (t, c) => uhtmlRender(c, t) })(() => {
  const myRef = useRef<{
    generateProgress?: Generator;
    togglePause: (isPause?: boolean) => void;
  } | null>(null);

  const [loaderConfig, setLoaderConfig] = useState({
    duration: 2000,
    stepsCount: 1,
  });

  const [color, setColor] = useState<string>('#ef534e');
  const [colorInterval, setColorInterval] = useState<NodeJS.Timeout | null>();

  const handleProgress = useCallback(() => {
    console.log(myRef.current);
    if (myRef.current?.generateProgress !== undefined) {
      const r = myRef.current.generateProgress.next();
      if (r.value === 1) {
        setTimeout(() => {
          myRef.current?.togglePause(true);
        }, 300);
        setTimeout(() => {
          myRef.current?.togglePause(false);
        }, 1000);
        setTimeout(() => {
          myRef.current?.togglePause(true);
        }, 2000);
        setTimeout(() => {
          myRef.current?.togglePause(false);
        }, 3000);
      }
      console.log(JSON.stringify(r));
    }
  }, []);

  const handleColor = useCallback(
    (e: InputEvent) => {
      console.log((e.target as HTMLInputElement).value);
      setColor((e.target as HTMLInputElement).value);
    },
    [setColor]
  );

  const randomizeColor = useCallback(() => {
    if (colorInterval != null) {
      clearInterval(colorInterval);
      setColorInterval(null);
    } else {
      setColorInterval(
        setInterval(() => {
          const letters = '0123456789ABCDEF';
          let color = '#';
          for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          setColor(color);
        }, 700)
      );
    }
  }, [setColor, colorInterval]);

  return (
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
        Progress loading
      </button>

      <button onclick={() => myRef.current?.togglePause()} class="item">
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
          setLoaderConfig(JSON.parse((e.currentTarget as HTMLTextAreaElement).value));
        }}
      ></textarea>
    </>
  );
})('demo-app');
