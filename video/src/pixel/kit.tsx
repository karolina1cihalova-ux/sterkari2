import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { H, W } from '../theme';

/**
 * Pixel-art kit shared by the two game-style videos.
 * Everything is drawn in code as SVG, there are no image files.
 * One game pixel = 24 real pixels, so the 1080×1920 canvas is a 45×80 game screen.
 */
export const P = 24;
export const VW = W / P; // 45
export const VH = H / P; // 80

/** Palette: brand colours plus copper and turquoise from the real walls. One letter per colour for sprites. */
export const PAL: Record<string, string> = {
  k: '#1a1a1a', // ink
  w: '#f7f4ef', // paper
  d: '#d9d3c9', // stone (shade on white)
  t: '#c45c26', // terracotta
  r: '#96441a', // dark terracotta
  l: '#e8a37f', // light terracotta
  s: '#f0c39e', // skin
  h: '#4a3226', // hair, boots
  g: '#c9ccd3', // steel
  G: '#8b9099', // dark steel
  b: '#8a5a34', // wood
  c: '#b87333', // copper
  q: '#3f9a94', // turquoise
  Q: '#7cc4b8', // light turquoise
  y: '#e3b23c', // gold
  e: '#b9b4ab', // grey wall
  E: '#8c8780', // dark grey
  x: '#2b2724', // black shirt
};

/** Deterministic 0–1 noise from two integers. */
export const hash = (a: number, b: number) => {
  let h = Math.imul(a, 374761393) + Math.imul(b, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

/** Sprite drawn from rows of palette letters ("." = empty). `outline` adds a 1-pixel ink edge. */
export const Sprite: React.FC<{
  rows: string[];
  /** size of one sprite pixel in real pixels */
  px?: number;
  outline?: boolean;
  flip?: boolean;
  style?: CSSProperties;
}> = ({ rows, px = P, outline = false, flip = false, style }) => {
  const cols = Math.max(...rows.map((r) => r.length));
  const pad = outline ? 1 : 0;
  const paths = useMemo(() => {
    const at = (x: number, y: number) => rows[y]?.[x] ?? '.';
    const byColor: Record<string, string> = {};
    const add = (key: string, x: number, y: number) => {
      byColor[key] = (byColor[key] ?? '') + `M${x + pad} ${y + pad}h1v1h-1z`;
    };
    for (let y = -pad; y < rows.length + pad; y++) {
      for (let x = -pad; x < cols + pad; x++) {
        const c = at(x, y);
        if (c !== '.') add(c, x, y);
        else if (outline && [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)].some((n) => n !== '.')) add('k', x, y);
      }
    }
    return Object.entries(byColor);
  }, [rows, cols, outline, pad]);

  const w = cols + 2 * pad;
  const h = rows.length + 2 * pad;
  return (
    <svg
      width={w * px}
      height={h * px}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      style={{ display: 'block', margin: -pad * px, transform: flip ? 'scaleX(-1)' : undefined, ...style }}
    >
      {paths.map(([key, d]) => (
        <path key={key} d={d} fill={PAL[key] ?? key} />
      ))}
    </svg>
  );
};

/* ---------- Sprites ---------- */

const HEAD = ['....hhhhh...', '...hhhhhhh..', '...hhsssss..', '...hssskss..', '...hssssss..', '....sssss...'];
const BODY = ['...tttttt...', '..ttwttwtt..', '..stwwwwts..', '..stwwwwts..', '...wwwwww...', '...wwwwww...'];
const BODY_UP = ['.s.tttttt.s.', '.tttwttwttt.', '...twwwwt...', '...twwwwt...', '...wwwwww...', '...wwwwww...'];
const LEGS_STAND = ['...ww..ww...', '...ww..ww...', '...ww..ww...', '..hhh..hhh..'];
const LEGS_STRIDE = ['...ww..ww...', '..ww....ww..', '.ww......ww.', 'hhh......hhh'];
const LEGS_PASS = ['...wwwww....', '....www.....', '....www.....', '....hhhh....'];
const LEGS_TUCK = ['..www..www..', '..hh....hh..', '............', '............'];

/** The player: dark hair, terracotta shirt, white painter's overalls. 12×16, faces right. */
export const HERO = {
  stand: [...HEAD, ...BODY, ...LEGS_STAND],
  run1: [...HEAD, ...BODY, ...LEGS_STRIDE],
  run2: [...HEAD, ...BODY, ...LEGS_PASS],
  jump: [...HEAD, ...BODY_UP, ...LEGS_TUCK],
  cheer: [...HEAD, ...BODY_UP, ...LEGS_STAND],
};

const swap = (rows: string[], map: Record<string, string>) => rows.map((r) => r.replace(/./g, (c) => map[c] ?? c));

/** The professional: hard hat and dark overalls. */
export const PRO = [
  '...yyyyyy...',
  '..yyyyyyyyy.',
  ...swap(HEAD.slice(2), {}),
  ...swap(BODY, { t: 'G', w: 'E' }),
  ...swap(LEGS_STAND, { w: 'E' }),
];

/** The guide from Stěrkaři: beard and black T-shirt. */
export const GUIDE = [
  ...HEAD.slice(0, 4),
  '...hhhssss..',
  '....hhhhh...',
  ...swap(BODY, { t: 'x', w: 'e' }),
  ...swap(LEGS_STAND, { w: 'e' }),
];

/** Float (hladítko): steel blade with a wooden handle. */
export const TROWEL = ['gggggggg', 'GGGGGGGG', '...bb...', '..bbbb..'];

export const ICON = {
  // clock: the workshop takes 2 to 8 hours
  hodiny: [
    '..kkkkkk..',
    '.kwwwwwwk.',
    'kwwwkwwwwk',
    'kwwwkwwwwk',
    'kwwwkwwwwk',
    'kwwwkkkwwk',
    'kwwwwwwwwk',
    'kwwwwwwwwk',
    '.kwwwwwwk.',
    '..kkkkkk..',
  ],
  // bucket of material
  material: [
    '..GGGGGG..',
    '.G......G.',
    'kkkkkkkkkk',
    'kllttttttk',
    'kltttttrrk',
    '.kltttrrk.',
    '.kltttrrk.',
    '.kttttrrk.',
    '..kkkkkk..',
    '..........',
  ],
  // float: borrowed tools
  naradi: [
    '..........',
    'kkkkkkkkkk',
    'kggggggggk',
    'kGGGGGGGGk',
    'kkkkkkkkkk',
    '...kbbk...',
    '.kkkbbkkk.',
    '.kbbbbbbk.',
    '.kkkkkkkk.',
    '..........',
  ],
  // phone: support during the job
  telefon: [
    '..kkkkkk..',
    '..kQQQQk..',
    '..kQqqQk..',
    '..kQqqQk..',
    '..kQqqQk..',
    '..kQQQQk..',
    '..kkkkkk..',
    '..kkwwkk..',
    '..kkkkkk..',
    '..........',
  ],
};

export const HEART = ['.tt.tt.', 'tlttttt', 'ttttttt', '.ttttt.', '..ttt..', '...t...'];
export const STAR = ['..y..', '..y..', 'yyyyy', '..y..', '..y..'];
export const CURSOR = ['t....', 'ttt..', 'ttttt', 'ttt..', 't....'];

/* ---------- Walls ---------- */

/** Grey brick wall, `cols`×`rows` game pixels, scrolled left by `scroll` game pixels. */
export const Bricks: React.FC<{ cols: number; rows: number; scroll?: number; style?: CSSProperties }> = ({
  cols,
  rows,
  scroll = 0,
  style,
}) => {
  const BW = 8;
  const BH = 4;
  const shades = ['#b9b4ab', '#c3beb5', '#aeaaa1', '#bdb8af'];
  const first = Math.floor(scroll / BW);
  const shift = scroll - first * BW;
  const bricks: ReactNode[] = [];
  for (let r = 0; r < Math.ceil(rows / BH); r++) {
    const offset = r % 2 ? BW / 2 : 0;
    for (let c = -1; c <= Math.ceil(cols / BW) + 1; c++) {
      const shade = shades[Math.floor(hash(c + first, r) * shades.length)];
      bricks.push(<rect key={`${r}-${c}`} x={c * BW + offset - shift} y={r * BH} width={BW - 1} height={BH - 1} fill={shade} />);
    }
  }
  return (
    <svg width={cols * P} height={rows * P} viewBox={`0 0 ${cols} ${rows}`} shapeRendering="crispEdges" style={{ display: 'block', background: '#9a958c', ...style }}>
      {bricks}
    </svg>
  );
};

/** Finished stucco: blotchy copper with turquoise hollows, like the Metalická skála wall. */
export const Stucco: React.FC<{ cols: number; rows: number; seed?: number; style?: CSSProperties }> = ({ cols, rows, seed = 0, style }) => {
  const paths = useMemo(() => {
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const noise = (x: number, y: number, cell: number, s: number) => {
      const gx = Math.floor(x / cell);
      const gy = Math.floor(y / cell);
      const fx = smooth(x / cell - gx);
      const fy = smooth(y / cell - gy);
      const a = hash(gx + s, gy);
      const b = hash(gx + 1 + s, gy);
      const c = hash(gx + s, gy + 1);
      const d = hash(gx + 1 + s, gy + 1);
      return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
    };
    const colors = ['#2f7f7a', '#3f9a94', '#7cc4b8', '#a4622a', '#b87333', '#c98a4b', '#dba36a'];
    const d: string[] = colors.map(() => '');
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // big blotches + diagonal trowel streaks + grain
        const n = 0.55 * noise(x, y, 9, seed) + 0.3 * noise(x + y, y - x, 5, seed + 40) + 0.15 * hash(x + seed, y);
        const i = n < 0.3 ? 0 : n < 0.36 ? 1 : n < 0.4 ? 2 : n < 0.47 ? 3 : n < 0.6 ? 4 : n < 0.7 ? 5 : 6;
        d[i] += `M${x} ${y}h1v1h-1z`;
      }
    }
    return d;
  }, [cols, rows, seed]);
  const colors = ['#2f7f7a', '#3f9a94', '#7cc4b8', '#a4622a', '#b87333', '#c98a4b', '#dba36a'];
  return (
    <svg width={cols * P} height={rows * P} viewBox={`0 0 ${cols} ${rows}`} shapeRendering="crispEdges" style={{ display: 'block', ...style }}>
      {paths.map((d, i) => (
        <path key={colors[i]} d={d} fill={colors[i]} />
      ))}
    </svg>
  );
};

/** Clip-path that hides everything left of a ragged, stepped edge at game-pixel column `front`. */
export const raggedEdge = (front: number, rows: number, cols: number) => {
  const points: string[] = [];
  for (let r = 0; r < rows; r++) {
    const x = Math.max(0, Math.round(front + Math.sin(r / 5) * 2.5 + hash(r, 9) * 3)) * P;
    points.push(`${x}px ${r * P}px`, `${x}px ${(r + 1) * P}px`);
  }
  points.push(`${cols * P}px ${rows * P}px`, `${cols * P}px 0px`);
  return `polygon(${points.join(',')})`;
};

/* ---------- Interface ---------- */

/** Box with the classic notched pixel border and a hard drop shadow. */
export const Panel: React.FC<{ children?: ReactNode; style?: CSSProperties; fill?: string; edge?: string; b?: number }> = ({
  children,
  style,
  fill = PAL.w,
  edge = PAL.k,
  b = 12,
}) => (
  <div
    style={{
      background: fill,
      boxShadow: `0 -${b}px 0 ${edge}, 0 ${b}px 0 ${edge}, -${b}px 0 0 ${edge}, ${b}px 0 0 ${edge}, ${b}px ${2 * b}px 0 rgb(26 26 26 / 0.3), ${2 * b}px ${b}px 0 rgb(26 26 26 / 0.3)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Typewriter: the part of `text` typed by `frame`, starting at `at`. */
export const typed = (text: string, frame: number, at: number, perFrame = 1) =>
  text.slice(0, Math.max(0, Math.floor((frame - at) * perFrame)));

/** On/off blink. */
export const blink = (frame: number, period = 16) => Math.floor(frame / period) % 2 === 0;

/**
 * Scene change: blocks cover the screen in a scattered order, then clear again.
 * Put it above both scenes; the scene underneath should switch at `at + 8`.
 */
export const BlockDissolve: React.FC<{ at: number; color?: string }> = ({ at, color = PAL.k }) => {
  const f = useCurrentFrame();
  if (f < at || f >= at + 16) return null;
  const size = 120;
  const blocks: ReactNode[] = [];
  for (let y = 0; y < H / size; y++) {
    for (let x = 0; x < W / size; x++) {
      const order = hash(x, y) * 7;
      const on = f - at < 8 ? f - at >= order : f - at - 8 < order;
      if (on) blocks.push(<div key={`${x}-${y}`} style={{ position: 'absolute', left: x * size, top: y * size, width: size, height: size, background: color }} />);
    }
  }
  return <AbsoluteFill>{blocks}</AbsoluteFill>;
};

/** Short burst of stars flying outwards (pickup, level complete). */
export const Burst: React.FC<{ at: number; x: number; y: number; count?: number; reach?: number }> = ({ at, x, y, count = 8, reach = 9 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 14) return null;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + 0.4;
        const dist = Math.round((reach * t) / 14);
        return (
          <div key={i} style={{ position: 'absolute', left: Math.round(x + Math.cos(angle) * dist) * P, top: Math.round(y + Math.sin(angle) * dist) * P, opacity: t > 10 ? 0.5 : 1 }}>
            <Sprite rows={STAR} px={P / 2} />
          </div>
        );
      })}
    </>
  );
};
