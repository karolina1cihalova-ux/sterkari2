import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { NAME, PHOTO } from '../photos';
import { C, EASE_IN_OUT, SAFE_BOTTOM, SIDE, tween } from '../theme';
import { Line, Photo, Sheen, Tag } from '../ui';

/** 0 – 6.4 s: slow close-ups of three real walls with the hook on top. */
const SHOT = 64;
const SHOTS = [
  { src: PHOTO.skala, name: NAME.skala, origin: '35% 55%' },
  { src: PHOTO.metamorfica, name: NAME.metamorfica, origin: '55% 70%' },
  { src: PHOTO.rozpraskana, name: NAME.rozpraskana, origin: '50% 45%' },
];

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#1a1410' }}>
      {SHOTS.map((shot, i) => {
        const start = i * SHOT;
        // Each new wall is pulled up over the last one, in the same direction as the paper wipe
        const hidden = i === 0 ? 0 : tween(f, start - 9, start + 9, [100, 0], EASE_IN_OUT);
        if (hidden === 100) return null;
        return (
          <AbsoluteFill key={shot.name} style={{ clipPath: `inset(${hidden}% 0 0 0)` }}>
            <Photo src={shot.src} span={[start - 9, start + SHOT + 40]} scale={[1.05, 1.22]} origin={shot.origin} />
            <Sheen at={start + 6} />
          </AbsoluteFill>
        );
      })}

      {/* Warm dark fade so the white headline reads on every wall */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgb(22 15 10 / 0.86) 0%, rgb(22 15 10 / 0.62) 30%, rgb(22 15 10 / 0.18) 56%, rgb(22 15 10 / 0) 70%)',
        }}
      />

      <div style={{ position: 'absolute', left: SIDE, right: SIDE, bottom: SAFE_BOTTOM }}>
        {/* Name of the wall on screen */}
        <div style={{ position: 'relative', height: 70, marginBottom: 44 }}>
          {SHOTS.map((shot, i) => {
            const start = i * SHOT;
            const last = i === SHOTS.length - 1;
            return (
              <div key={shot.name} style={{ position: 'absolute', left: 0, top: 0 }}>
                <Line at={start + 6} out={last ? undefined : start + SHOT - 10} style={{ borderRadius: 999 }}>
                  <Tag>{shot.name}</Tag>
                </Line>
              </div>
            );
          })}
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 138,
            lineHeight: 1.04,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: C.white,
          }}
        >
          <Line at={6}>Vypadá to</Line>
          <Line at={10}>jako práce</Line>
          <Line at={14}>pro profíka.</Line>
        </h1>
      </div>
    </AbsoluteFill>
  );
};
