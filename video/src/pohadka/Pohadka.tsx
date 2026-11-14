import type { ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { STORY_FONT, useFonts } from '../fonts';
import { C, EASE_IN_OUT, EASE_SHEEN, FONT, SHADOW_FLOAT, SHADOW_LIFT, SHADOW_REST, SIDE, W, tween } from '../theme';
import { Arrow, Line, Rise } from '../ui';

/**
 * "Pohádka o nudné stěně", 30 s, vertical. A storybook cartoon drawn as flat SVG shapes:
 * a sad grey wall, its owner who goes to a workshop, and the wall transformed.
 * Frames are absolute (30 fps).
 */
const T = {
  p2: 140, // the wall thinks only a professional can help
  p3: 260, // the owner goes to the workshop and gets three gifts
  gifts: [336, 372, 408],
  p4: 480, // she transforms the wall herself
  p5: 620, // "…zdobí obývák dodnes."
  end: 716, // the picture shrinks, headline and button
};

const INK = '#2f2a27';
const SKIN = '#f0c39e';
const OLIVE = '#7c8560';
const LEAF = '#6f7a55';

// Picture frame on the page
const BOX = { top: 260, height: 980, small: 520 };
const PW = W - 2 * SIDE; // 936

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------- pieces of the drawing ---------- */

/** Thick trowel strokes that cover the grey wall. Each is drawn along its path. */
const STROKES: { d: string; color: string; width: number }[] = [
  { d: 'M-60 640 Q 190 420 430 610', color: '#b87333', width: 200 },
  { d: 'M40 390 Q 290 190 530 390', color: '#d98a55', width: 200 },
  { d: 'M-60 150 Q 220 -30 490 150', color: '#b87333', width: 210 },
  { d: 'M320 720 Q 560 480 810 670', color: '#c45c26', width: 200 },
  { d: 'M410 330 Q 660 120 910 300', color: '#c98a4b', width: 200 },
  { d: 'M390 80 Q 700 -70 1000 110', color: '#b87333', width: 210 },
  { d: 'M640 560 Q 830 370 1010 540', color: '#d98a55', width: 200 },
  { d: 'M100 700 Q 480 620 980 730', color: '#a4622a', width: 110 },
  { d: 'M80 520 Q 260 370 430 470', color: '#3f9a94', width: 44 },
  { d: 'M520 235 Q 700 110 860 215', color: '#7cc4b8', width: 36 },
  { d: 'M600 650 Q 760 540 905 610', color: '#3f9a94', width: 34 },
  { d: 'M150 110 Q 280 40 400 95', color: '#7cc4b8', width: 28 },
];

const Sparkle: React.FC<{ x: number; y: number; size: number; phase: number; from: number }> = ({ x, y, size, phase, from }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const pop = tween(f, from, from + 10, [0, 1]);
  const s = pop * (0.75 + 0.25 * Math.sin((f + phase) / 5));
  return (
    <path
      d="M0 -1 C 0.12 -0.12 0.12 -0.12 1 0 C 0.12 0.12 0.12 0.12 0 1 C -0.12 0.12 -0.12 0.12 -1 0 C -0.12 -0.12 -0.12 -0.12 0 -1Z"
      fill="#fff6e0"
      transform={`translate(${x} ${y}) scale(${size * s}) rotate(${(f + phase) * 1.5})`}
    />
  );
};

/** The wall's face. mood 0 = sad, 1 = happy. */
const Face: React.FC<{ mood: number; look: [number, number] }> = ({ mood, look }) => {
  const f = useCurrentFrame();
  const blinking = f % 74 > 70 ? 0.12 : 1;
  const ry = lerp(24, 34, mood) * blinking;
  const eye = (cx: number) => (
    <g>
      <ellipse cx={cx} cy={300} rx={34} ry={ry} fill="#fff" />
      {blinking === 1 && <circle cx={cx + look[0]} cy={300 + look[1]} r={13} fill={INK} />}
    </g>
  );
  // sad brows slope down towards the outside, happy ones lift and flatten
  const inner = lerp(246, 240, mood);
  const outer = lerp(270, 244, mood);
  return (
    <g>
      <circle cx={478} cy={368} r={28} fill="#e8846a" opacity={0.6 * mood} />
      <circle cx={722} cy={368} r={28} fill="#e8846a" opacity={0.6 * mood} />
      {eye(530)}
      {eye(670)}
      <g stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none">
        <path d={`M494 ${outer} L562 ${inner}`} />
        <path d={`M638 ${inner} L706 ${outer}`} />
        <path d={`M${lerp(556, 540, mood)} 404 Q 600 ${lerp(372, 468, mood)} ${lerp(644, 660, mood)} 404`} />
      </g>
    </g>
  );
};

/** The owner: bun, olive jumper, a float in her hand. Origin at her feet. */
const Owner: React.FC<{ arm: number; step: number; smile: number }> = ({ arm, step, smile }) => (
  <g transform={`translate(0 ${-Math.abs(Math.sin(step)) * 10})`}>
    <ellipse cx={0} cy={4} rx={70} ry={10} fill="rgb(60 40 25 / 0.18)" />
    {/* legs */}
    <rect x={-32} y={-118} width={26} height={118} rx={11} fill={INK} transform={`rotate(${Math.sin(step) * 12} -19 -118)`} />
    <rect x={6} y={-118} width={26} height={118} rx={11} fill={INK} transform={`rotate(${-Math.sin(step) * 12} 19 -118)`} />
    {/* back arm */}
    <path d="M-42 -226 L-62 -146" stroke={OLIVE} strokeWidth={30} strokeLinecap="round" />
    <circle cx={-64} cy={-136} r={15} fill={SKIN} />
    {/* body */}
    <rect x={-54} y={-256} width={108} height={160} rx={42} fill={OLIVE} />
    {/* head */}
    <circle cx={-40} cy={-352} r={24} fill="#4a3226" />
    <circle cx={2} cy={-306} r={52} fill={SKIN} />
    <path d="M-50 -306 A 52 52 0 0 1 46 -334 Q 6 -322 -18 -296 Q -34 -300 -50 -306Z" fill="#4a3226" />
    <circle cx={18} cy={-304} r={5.5} fill={INK} />
    <circle cx={40} cy={-304} r={5.5} fill={INK} />
    <path d={`M14 -284 Q 28 ${-284 + 14 * smile} 42 -284`} stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
    {/* arm with the float; 0° points right, negative lifts it */}
    <g transform={`rotate(${arm} 40 -226)`}>
      <rect x={150} y={-292} width={16} height={132} rx={4} fill="#c9ccd3" stroke="#8b9099" strokeWidth={3} />
      <rect x={128} y={-242} width={24} height={32} rx={6} fill="#8a5a34" />
      <path d="M40 -226 L126 -226" stroke={OLIVE} strokeWidth={30} strokeLinecap="round" />
      <circle cx={132} cy={-226} r={16} fill={SKIN} />
    </g>
  </g>
);

// Line icons from Hero.astro (24×24)
const ICONS = [
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 2" />
  </>,
  <>
    <path d="M3.5 7.6 12 3.2l8.5 4.4v8.8L12 20.8l-8.5-4.4z" />
    <path d="M3.5 7.6 12 12l8.5-4.4M12 12v8.8M7.8 5.4l8.5 4.4" />
  </>,
  <path d="M5.2 3.5h3.3l1.7 4.2-2.2 1.4a11.5 11.5 0 0 0 6.9 6.9l1.4-2.2 4.2 1.7v3.3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3.2 5.6a2 2 0 0 1 2-2.1z" />,
];
const GIFTS = ['Individuální workshop, 2 až 8 hodin', 'Nářadí a 20 % rezerva zdarma', 'Podpora na telefonu, když se zaseknete'];
const GIFT_AT: [number, number][] = [
  [330, 250],
  [250, 120],
  [420, 110],
];

/* ---------- the drawing ---------- */
const Picture: React.FC = () => {
  const f = useCurrentFrame();

  // The wall cheers up while it is being painted
  const mood = tween(f, T.p4 + 40, T.p4 + 110, [0, 1], EASE_IN_OUT);
  const look: [number, number] =
    f < T.p2 ? [0, 9] : f < T.p3 ? [-9, -9] : f < T.p4 ? [-13, 3] : f < T.p4 + 90 ? [-12, 0] : [0, 2];

  // Owner walks in from the left, waves the float, then gets to work
  const walk = tween(f, T.p3 + 2, T.p3 + 44, [0, 1], EASE_IN_OUT);
  const ownerX = lerp(-170, 180, walk);
  const walking = walk > 0 && walk < 1;
  const painting = f >= T.p4 + 6 && f < T.p5 - 8;
  const arm = painting ? -42 + 34 * Math.sin((f - T.p4) / 3.6) : f >= T.p5 - 8 ? tween(f, T.p5 - 8, T.p5 + 6, [-42, 58]) : f >= T.p3 + 44 ? -52 + 10 * Math.sin(f / 6) : 58;

  // Thought bubble
  const bubble = tween(f, T.p2 + 8, T.p2 + 24, [0, 1]) * (1 - tween(f, T.p3 - 14, T.p3 - 4, [0, 1], EASE_IN_OUT));

  // Plant droops while the wall is sad
  const leaf = (droop: number, up: number) => lerp(droop, up, mood);

  return (
    <svg width={PW} height={BOX.height} viewBox={`0 0 ${PW} ${BOX.height}`} style={{ display: 'block' }}>
      <defs>
        <clipPath id="wall">
          <rect x={0} y={0} width={PW} height={740} />
        </clipPath>
      </defs>

      {/* wall */}
      <rect x={0} y={0} width={PW} height={740} fill="#c4bfb6" />
      <g clipPath="url(#wall)">
        <rect x={0} y={0} width={PW} height={740} fill="#b87333" opacity={tween(f, T.p4 + 104, T.p4 + 130, [0, 1])} />
        {STROKES.map((s, i) => {
          const start = T.p4 + 8 + i * 10;
          const drawn = tween(f, start, start + 26, [0, 1], EASE_IN_OUT);
          if (drawn === 0) return null;
          return <path key={s.d} d={s.d} pathLength={1} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - drawn} />;
        })}
      </g>

      {/* lamp */}
      <path d="M88 0 V74" stroke={INK} strokeWidth={5} />
      <path d="M62 74 H114 L138 138 H38Z" fill={INK} />
      <ellipse cx={88} cy={140} rx={30} ry={9} fill="#f6d98a" />

      <Face mood={mood} look={look} />

      {/* sigh */}
      {f > 40 && f < 110 && (
        <g opacity={1 - tween(f, 80, 108, [0, 1])} fill="#fff" transform={`translate(${tween(f, 40, 108, [0, 60])} ${-tween(f, 40, 108, [0, 50])})`}>
          <circle cx={690} cy={420} r={tween(f, 40, 60, [0, 16])} />
          <circle cx={712} cy={404} r={tween(f, 46, 66, [0, 22])} />
          <circle cx={740} cy={416} r={tween(f, 52, 72, [0, 15])} />
        </g>
      )}

      {/* thought bubble: a professional in a hard hat, and a question mark */}
      {bubble > 0 && (
        <g transform={`translate(330 170) scale(${bubble}) translate(-330 -170)`}>
          <circle cx={476} cy={262} r={13} fill="#fff" />
          <circle cx={440} cy={236} r={22} fill="#fff" />
          <ellipse cx={300} cy={160} rx={180} ry={118} fill="#fff" />
          <rect x={206} y={196} width={92} height={60} rx={28} fill="#8b9099" />
          <circle cx={252} cy={160} r={38} fill={SKIN} />
          <path d="M210 152 A 42 42 0 0 1 294 152Z" fill="#e3b23c" />
          <rect x={200} y={148} width={104} height={12} rx={6} fill="#e3b23c" />
          <text x={372} y={206} fontFamily={STORY_FONT} fontSize={150} fontWeight={700} fill={C.accent} textAnchor="middle">
            ?
          </text>
        </g>
      )}

      {/* skirting board and floor */}
      <rect x={0} y={740} width={PW} height={26} fill="#f2ede4" />
      <rect x={0} y={766} width={PW} height={BOX.height - 766} fill="#c79d6d" />
      {[826, 892, 958].map((y) => (
        <path key={y} d={`M0 ${y} H${PW}`} stroke="#ad8358" strokeWidth={4} />
      ))}

      {/* plant */}
      <g>
        <ellipse cx={840} cy={628} rx={17} ry={56} fill={LEAF} transform={`rotate(${leaf(-82, -30)} 840 684)`} />
        <ellipse cx={840} cy={620} rx={17} ry={62} fill="#7f8a62" transform={`rotate(${leaf(46, 0)} 840 684)`} />
        <ellipse cx={840} cy={628} rx={17} ry={56} fill={LEAF} transform={`rotate(${leaf(88, 30)} 840 684)`} />
        <rect x={792} y={676} width={96} height={20} rx={6} fill="#a94d1e" />
        <path d="M800 696 H880 L868 772 H812Z" fill={C.accent} />
        <ellipse cx={840} cy={776} rx={56} ry={8} fill="rgb(60 40 25 / 0.18)" />
      </g>

      {/* sparkles on the finished wall */}
      {[
        [150, 250, 30],
        [400, 560, 22],
        [800, 150, 34],
        [300, 90, 20],
        [760, 520, 26],
        [560, 110, 18],
      ].map(([x, y, size], i) => (
        <Sparkle key={i} x={x} y={y} size={size} phase={i * 23} from={T.p4 + 96 + i * 7} />
      ))}

      {/* the owner */}
      {f >= T.p3 && (
        <g transform={`translate(${ownerX} 772)`}>
          <Owner arm={arm} step={walking ? f / 3 : 0} smile={f >= T.p4 + 60 ? 1.4 : 0.8} />
        </g>
      )}

      {/* three gifts from the workshop */}
      {T.gifts.map((t, i) => {
        const pop = tween(f, t, t + 14, [0, 1]) * (1 - tween(f, T.p4 - 14, T.p4 - 4, [0, 1], EASE_IN_OUT));
        if (pop === 0) return null;
        const [x, y] = GIFT_AT[i];
        return (
          <g key={t} transform={`translate(${x} ${y + Math.sin((f + i * 20) / 9) * 8}) scale(${pop})`}>
            <circle r={66} fill="#fff" />
            <circle r={66} fill="none" stroke={C.accent} strokeWidth={6} />
            <g transform="translate(-36 -36) scale(3)" fill="none" stroke={C.accent} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              {ICONS[i]}
            </g>
          </g>
        );
      })}
    </svg>
  );
};

/* ---------- words under the drawing ---------- */
const Caption: React.FC<{ from: number; to: number; lines: ReactNode[] }> = ({ from, to, lines }) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 14) return null;
  return (
    <div style={{ position: 'absolute', left: SIDE, right: SIDE, top: BOX.top + BOX.height + 54, fontFamily: STORY_FONT, fontSize: 70, lineHeight: 1.18, fontWeight: 600, letterSpacing: '-0.015em', color: C.ink }}>
      {lines.map((line, i) => (
        <Line key={i} at={from + i * 5} out={to + i * 2}>
          {line}
        </Line>
      ))}
    </div>
  );
};

export const Pohadka: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();

  // End: the picture shrinks to a banner and makes room for the headline
  const shrink = tween(f, T.end, T.end + 26, [0, 1], EASE_IN_OUT);
  const boxHeight = lerp(BOX.height, BOX.small, shrink);
  const e = f - T.end;
  const lift = tween(e, 112, 120, [0, 1], EASE_IN_OUT);
  const sheen = tween(e, 112, 139, [135, -35], EASE_SHEEN);

  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT, color: C.ink, WebkitFontSmoothing: 'antialiased' }}>
      <div
        style={{
          position: 'absolute',
          left: SIDE,
          top: BOX.top,
          width: PW,
          height: boxHeight,
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: SHADOW_FLOAT,
          opacity: tween(f, 0, 12, [0, 1]),
          transform: `translateY(${tween(f, 0, 18, [40, 0])}px)`,
        }}
      >
        <div style={{ transform: `translateY(${-shrink * 185}px)` }}>
          <Picture />
        </div>
      </div>

      <Caption from={8} to={T.p2 - 14} lines={['Byla jednou jedna', 'nudná šedá stěna.']} />
      <Caption from={T.p2 + 4} to={T.p3 - 14} lines={['Myslela si, že ji zkrášlí', 'jen opravdový profík.']} />
      <Caption from={T.p3 + 4} to={T.gifts[0] - 16} lines={['Jenže její majitelka', 'zašla na workshop.']} />
      <Caption from={T.p4 + 4} to={T.p5 - 14} lines={['A pak ji vlastníma rukama', 'proměnila k nepoznání.']} />
      <Caption from={T.p5 + 2} to={T.end - 12} lines={['A jestli ji nepřemalovali,', 'zdobí obývák dodnes.']} />

      {/* The three gifts, listed as she receives them */}
      {f >= T.gifts[0] - 4 && f < T.p4 + 4 && (
        <div style={{ position: 'absolute', left: SIDE, right: SIDE, top: BOX.top + BOX.height + 50, display: 'grid', gap: 20 }}>
          {GIFTS.map((gift, i) => (
            <Rise key={gift} at={T.gifts[i]} out={T.p4 - 12} y={24} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <span style={{ flex: 'none', display: 'grid', placeItems: 'center', width: 68, height: 68, borderRadius: 999, background: C.accent, color: '#fff', fontSize: 38, fontWeight: 700 }}>{i + 1}</span>
              <span style={{ fontFamily: STORY_FONT, fontSize: 45, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{gift}</span>
            </Rise>
          ))}
        </div>
      )}

      {/* 23.9 – 30 s: headline of the site and the call to action */}
      {f >= T.end && (
        <div style={{ position: 'absolute', left: SIDE, right: SIDE, top: BOX.top + BOX.small + 64 }}>
          <Rise at={T.end + 20} y={0} style={{ fontSize: 48, lineHeight: 1, fontWeight: 800, letterSpacing: '-0.04em', color: '#000' }}>
            STĚRKAŘI.
          </Rise>
          <h1 style={{ margin: '40px 0 0', fontSize: 112, lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.03em' }}>
            <Line at={T.end + 24}>Stěrku</Line>
            <Line at={T.end + 28}>zvládnete sami.</Line>
            <span style={{ color: C.accent }}>
              <Line at={T.end + 38}>My vám</Line>
              <Line at={T.end + 42}>ukážeme jak.</Line>
            </span>
          </h1>
          <Rise at={T.end + 64} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 56 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 24,
                height: 116,
                padding: '0 54px',
                borderRadius: 22,
                backgroundColor: lift > 0 ? '#2b2724' : C.ink,
                backgroundImage: 'linear-gradient(105deg, transparent 40%, rgb(255 255 255 / 0.18) 50%, transparent 60%)',
                backgroundSize: '280% 100%',
                backgroundPosition: `${sheen}% 0`,
                backgroundRepeat: 'no-repeat',
                color: C.white,
                fontSize: 35,
                fontWeight: 600,
                letterSpacing: '0.025em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                boxShadow: lift > 0.5 ? SHADOW_LIFT : SHADOW_REST,
                transform: `translateY(${-6 * lift}px)`,
              }}
            >
              Chci na workshop
              <span style={{ display: 'grid', transform: `translateX(${9 * lift}px)` }}>
                <Arrow size={40} color={C.accentLight} />
              </span>
            </span>
            <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.02em' }}>sterkari.cz</span>
          </Rise>
        </div>
      )}
    </AbsoluteFill>
  );
};
