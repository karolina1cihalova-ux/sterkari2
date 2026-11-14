import { AbsoluteFill, Composition, Sequence } from 'remotion';
import { useFonts } from './fonts';
import { Level1 } from './level1/Level1';
import { MINI_FRAMES, Mini } from './mini/Mini';
import { Pohadka } from './pohadka/Pohadka';
import { End } from './scenes/End';
import { Facts } from './scenes/Facts';
import { Hook } from './scenes/Hook';
import { Turn } from './scenes/Turn';
import { Tutorial } from './tutorial/Tutorial';
import { C, FONT, FPS, H, T, W, WIPE } from './theme';

/**
 * Stěrkaři, 30 s, vertical 9:16.
 * Idea: the walls look like a professional's work, but you can do them yourself.
 * All copy comes from the site (hero headline, hero facts, workshop section).
 */
const Video: React.FC = () => {
  useFonts();

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

export const Root: React.FC = () => {
  const size = { durationInFrames: T.total, fps: FPS, width: W, height: H };
  return (
    <>
      {/* Photo version */}
      <Composition id="Sterkari" component={Video} {...size} />
      {/* Animated versions, no photos */}
      <Composition id="Level1" component={Level1} {...size} />
      <Composition id="Tutorial" component={Tutorial} {...size} />
      <Composition id="Pohadka" component={Pohadka} {...size} />
      {/* 10 s attention-grabber */}
      <Composition id="Mini" component={Mini} {...size} durationInFrames={MINI_FRAMES} />
    </>
  );
};
