import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, useCurrentFrame } from 'remotion';
import { C, EASE_IN_OUT, EASE_SHEEN, WIPE, tween } from './theme';

/**
 * One line of text that slides up from behind its own baseline.
 * `at` = frame it enters, `out` = frame it leaves (upwards). Frames are relative to the scene.
 */
export const Line: React.FC<{ at: number; out?: number; children: ReactNode; style?: CSSProperties }> = ({
  at,
  out,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const enter = tween(f, at, at + 22, [130, 0]);
  const leave = out === undefined ? 0 : tween(f, out, out + 12, [0, -130], EASE_IN_OUT);
  // Fully hidden before and after, so no accent ever peeks into the mask's padding
  const hidden = f < at || (out !== undefined && f >= out + 12);
  return (
    // The padding keeps Czech accents (Ě, Š, Ž) and descenders inside the mask
    <span
      style={{
        display: 'block',
        overflow: 'hidden',
        padding: '0.16em 0.06em',
        margin: '-0.16em -0.06em',
        visibility: hidden ? 'hidden' : undefined,
        ...style,
      }}
    >
      <span style={{ display: 'block', transform: `translateY(${enter + leave}%)`, whiteSpace: 'nowrap' }}>{children}</span>
    </span>
  );
};

/** Fades and lifts a block in; optional fade out. */
export const Rise: React.FC<{ at: number; out?: number; y?: number; children: ReactNode; style?: CSSProperties }> = ({
  at,
  out,
  y = 36,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const p = tween(f, at, at + 20, [0, 1]);
  const gone = out === undefined ? 0 : tween(f, out, out + 10, [0, 1], EASE_IN_OUT);
  return (
    <div style={{ opacity: p * (1 - gone), transform: `translateY(${(1 - p) * y - gone * y * 0.5}px)`, ...style }}>
      {children}
    </div>
  );
};

/**
 * Scene change: paper is pulled over the previous scene from the bottom, like one stroke of a trowel.
 * The edge is slightly slanted and leads with a sliver of terracotta.
 */
export const PaperWipe: React.FC<{ children: ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  // `ahead` moves the edge up by that many % of the height (the terracotta sliver)
  const edge = (p: number, ahead = 0) =>
    `polygon(0 ${120 - 120 * p - ahead}%, 100% ${104 - 120 * p - ahead}%, 100% 100%, 0 100%)`;
  const paper = tween(f, 0, WIPE, [0, 1], EASE_IN_OUT);
  return (
    <>
      {paper < 1 && <AbsoluteFill style={{ background: C.accent, clipPath: edge(paper, 4) }} />}
      <AbsoluteFill style={{ background: C.paper, clipPath: paper < 1 ? edge(paper) : undefined }}>{children}</AbsoluteFill>
    </>
  );
};

/** A photo that fills its box and slowly pushes in. */
export const Photo: React.FC<{
  src: string;
  /** frames the push-in runs over */
  span: [number, number];
  scale?: [number, number];
  origin?: string;
  position?: string;
}> = ({ src, span, scale = [1.06, 1.2], origin = '50% 50%', position = '50% 50%' }) => {
  const f = useCurrentFrame();
  const s = tween(f, span[0], span[1], scale, (t) => t);
  return (
    <Img
      src={src}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: position,
        transform: `scale(${s})`,
        transformOrigin: origin,
      }}
    />
  );
};

/** One soft band of light gliding across, like the site's "polished plaster" button hover. */
export const Sheen: React.FC<{ at: number; length?: number; strength?: number }> = ({ at, length = 46, strength = 0.2 }) => {
  const f = useCurrentFrame();
  const x = tween(f, at, at + length, [135, -35], EASE_SHEEN);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(105deg, transparent 38%, rgb(255 244 230 / ${strength}) 50%, transparent 62%)`,
        backgroundSize: '280% 100%',
        backgroundPosition: `${x}% 0`,
        backgroundRepeat: 'no-repeat',
        mixBlendMode: 'screen',
      }}
    />
  );
};

/** White name tag on top of a texture (the site's .wall-tag). */
export const Tag: React.FC<{ children: ReactNode }> = ({ children }) => (
  <span
    style={{
      display: 'inline-block',
      borderRadius: 999,
      background: 'rgb(255 255 255 / 0.92)',
      padding: '14px 30px',
      fontSize: 34,
      lineHeight: 1.2,
      fontWeight: 600,
      color: C.ink,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

/** Arrow from Arrow.astro. */
export const Arrow: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
);
