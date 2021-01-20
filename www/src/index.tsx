import { EG, useRef, useCallback, useState } from '@web-companions/fc';
import { loadingProgressBar } from '../../src';
import { render as uhtmlRender } from 'uhtml';

const LoadingProgressBar = loadingProgressBar('loading-progress-bar');

/**
 * ROOT element
 */
EG({ render: (t, c) => uhtmlRender(c, t) })(() => {
  const myRef = useRef<{
    generateProgress?: Generator;
    togglePause: (isPause?: boolean) => void;
  }|null>(null);

  const [loaderConfig, setLoaderConfig] = useState({
    duration: 2000,
    stepsCount: 1,
  });

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

  return (
    <>
      <LoadingProgressBar config={loaderConfig} ref={myRef}></LoadingProgressBar>
      <br />
      <button onclick={handleProgress}>Progress loading</button>
      <br />
      <button onclick={() => myRef.current?.togglePause()}>Pause/Run</button>
      <br />
      <textarea
        rows="10"
        value={JSON.stringify(loaderConfig, null, 2)}
        onchange={(e: Event) => {
          setLoaderConfig(JSON.parse((e.currentTarget as HTMLTextAreaElement).value));
        }}
      ></textarea>
    </>
  );
})('demo-app');
