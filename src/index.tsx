import { useState, useEffect } from 'haunted';
import { FC } from '@web-companions/fc';
import createEmotion, { Emotion } from 'create-emotion';

import style from './styles/$.scss';

interface LoadingProgressBarProps {
  ref?: { current?: any };
  config?: {
    duration?: number; // ms (2000ms by default)
    stepsCount?: number; // (1 by default)
  };
}

export const loadingProgressBarEl = FC(function (props: LoadingProgressBarProps = { ref: { current: {} } }) {
  const [config, setConfig] = useState({
    duration: 2000,
    stepsCount: 1,
    ...props.config,
  });
  const [frames, setFrames] = useState(undefined);
  const [isPause, setIsPause] = useState(false);
  const [emotionStylesTpl, setEmotionStylesTpl] = useState<HTMLTemplateElement>(undefined);
  const [{ css, keyframes }] = (useState(() => {
    let emotion;
    if (this.shadowRoot !== null) {
      const emotionTemplateContainer = document.createElement('template');
      emotionTemplateContainer.setAttribute('id', 'data-emotion');
      emotion = createEmotion({ container: emotionTemplateContainer });
      setEmotionStylesTpl(emotionTemplateContainer);
    } else {
      emotion = createEmotion();
    }

    return emotion;
  }) as unknown) as [Emotion];

  useEffect(() => {
    const _config = {
      duration: 2000,
      stepsCount: 1,
      ...props.config,
    };
    setConfig(_config);

    let index = 0;
    const generator = function* () {
      while (true) {
        if (index < _config.stepsCount) {
          const k = 100 / _config.stepsCount;
          setFrames(keyframes`
            from {
              width: ${index * k}%;
            }
            to {
              width: ${(index + 1) * k}%;
            }      
          `);

          yield ++index;
        } else {
          setIsPause(false);
          setFrames(undefined);
          index = 0;
          yield index;
        }
      }
    };

    props.ref = props.ref ?? {};
    props.ref.current = this ?? {};
    props.ref.current.generateProgress = generator();
    props.ref.current.togglePause = (pause: boolean) => setIsPause((hasPause) => (typeof pause === 'boolean' ? pause : !hasPause));
  }, [props.ref, props.config]);

  return (
    <>
      <style>{style}</style>
      {emotionStylesTpl}
      <div
        class={`yt-loader ${css`
          animation-name: ${frames};
          animation-duration: ${config.duration}ms;
          animation-play-state: ${isPause ? 'paused' : 'running'};
        `}`}
      ></div>
    </>
  );
}).element;
