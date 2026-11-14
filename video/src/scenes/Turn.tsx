import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, EASE_IN_OUT, SIDE, T, tween } from '../theme';
import { Line, PaperWipe } from '../ui';

/** 6.4 – 9.9 s: the hook is crossed out. "Není. Zvládnete to sami." */
const LENGTH = T.facts - T.turn;
const OUT = LENGTH - 14;

/** Terracotta line drawn through the text. */
const Strike: React.FC<{ at: number; children: ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const drawn = tween(f, at, at + 14, [0, 1], EASE_IN_OUT);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <span
        style={{
          position: 'absolute',
          left: '-1.5%',
          right: '-1.5%',
          top: '56%',
          height: 6,
          borderRadius: 3,
          background: C.accent,
          transform: `scaleX(${drawn})`,
          transformOrigin: 'left center',
        }}
      />
    </span>
  );
};

export const Turn: React.FC = () => (
  <PaperWipe>
    <div style={{ position: 'absolute', left: SIDE, right: SIDE, top: 500 }}>
      <p style={{ margin: 0, fontSize: 62, lineHeight: 1.22, fontWeight: 600, letterSpacing: '-0.01em', color: C.muted }}>
        <Line at={14} out={OUT}>
          <Strike at={30}>Vypadá to jako</Strike>
        </Line>
        <Line at={17} out={OUT + 1}>
          <Strike at={34}>práce pro profíka.</Strike>
        </Line>
      </p>

      <p style={{ margin: '34px 0 0', fontSize: 340, lineHeight: 1, fontWeight: 700, letterSpacing: '-0.045em', color: C.accent }}>
        <Line at={42} out={OUT + 2}>
          Není.
        </Line>
      </p>

      <h2 style={{ margin: '40px 0 0', fontSize: 132, lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.03em', color: C.ink }}>
        <Line at={58} out={OUT + 3}>
          Zvládnete
        </Line>
        <Line at={62} out={OUT + 4}>
          to sami.
        </Line>
      </h2>
    </div>
  </PaperWipe>
);
