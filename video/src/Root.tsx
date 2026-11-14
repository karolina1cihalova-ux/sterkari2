import '@fontsource-variable/dm-sans';
import { useEffect, useState } from 'react';
import { AbsoluteFill, Composition, Sequence, continueRender, delayRender } from 'remotion';
import { End } from './scenes/End';
import { Facts } from './scenes/Facts';
import { Hook } from './scenes/Hook';
import { Turn } from './scenes/Turn';
import { C, FONT, FPS, H, T, W, WIPE } from './theme';

/**
 * Stěrkaři, 30 s, vertical 9:16.
 * Idea: the walls look like a professional's work, but you can do them yourself.
 * All copy comes from the site (hero headline, hero facts, workshop section).
 */
const Video: React.FC = () => {
  // Hold rendering until DM Sans (latin + latin-ext for Czech) is ready
  const [handle] = useState(() => delayRender('DM Sans'));
  useEffect(() => {
    document.fonts
      .load(`700 100px "DM Sans Variable"`, 'Stěrkaři abc')
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill
      style={{
        background: C.paper,
        fontFamily: FONT,
        color: C.ink,
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility',
        fontOpticalSizing: 'auto',
      }}
    >
      {/* Each scene stays a little longer than its slot, so the next one can wipe over it */}
      <Sequence from={T.hook} durationInFrames={T.turn - T.hook + WIPE}>
        <Hook />
      </Sequence>
      <Sequence from={T.turn} durationInFrames={T.facts - T.turn}>
        <Turn />
      </Sequence>
      <Sequence from={T.facts} durationInFrames={T.end - T.facts + WIPE}>
        <Facts />
      </Sequence>
      <Sequence from={T.end} durationInFrames={T.total - T.end}>
        <End />
      </Sequence>
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="Sterkari" component={Video} durationInFrames={T.total} fps={FPS} width={W} height={H} />
);
