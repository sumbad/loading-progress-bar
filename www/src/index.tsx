import { useRef, useEffect, useCallback } from 'haunted';
import { FC } from '@web-companions/fc';
import { loadingProgressBarEl } from '../../src';
// import { loadingProgressBarEl } from '../../lib';

// console.log(loadingProgressBarEl);

const LoadingProgressBar = loadingProgressBarEl('loading-progress-bar');

/**
 * ROOT element
 */
FC(() => {
  const myRef = useRef<{ generateProgress?: Generator }>({});

  const handleProgress = useCallback(() => {
    if (myRef.current.generateProgress !== undefined) {
      const r = myRef.current.generateProgress.next();
      console.log(JSON.stringify(r));
    }
  }, []);

  return (
    <>
      <LoadingProgressBar ref={myRef}></LoadingProgressBar>
      {/* <loading-progress-bar ref={myRef}></loading-progress-bar> */}
      <br />
      <button onclick={handleProgress}>Progress loading</button>
      <br />
      <h1>Hello!</h1>
    </>
  );
}).element('demo-app');
