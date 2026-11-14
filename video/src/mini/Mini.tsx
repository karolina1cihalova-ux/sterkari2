import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { PIXEL_FONT, useFonts } from '../fonts';
import { PixelEnd } from '../pixel/PixelEnd';
import { Sfx } from '../pixel/Sfx';
import { BlockDissolve, Bricks, Burst, CURSOR, HERO, P, PAL, PRO, Panel, Sprite, Stucco, TROWEL, VW, blink } from '../pixel/kit';
import { H, SIDE, W } from '../theme';

/**
 * "Mini hra", 10 s, vertical. Almost no information, all attention:
 * pick the player in a 3-2-1 countdown, smash the grey wall into stucco with an accelerating combo,
 * level complete, headline. Frames are absolute (30 fps, 300 frames).
 */
const T = {
  pick: 28, // the cursor confirms "VY"
  game: 45, // the wall appears, "START!"
  done: 184, // level complete
  end: 240, // end screen (block dissolve 232–248)
  total: 300,
};

const FLOOR = 62;
const DARK = '#24201d';
const DIM = '#6b655d';

/** Trowel hits: frame, then where on the wall (game pixels) and how big the patch is. They speed up. */
const HITS: { at: number; x: number; y: number; r: number }[] = [
  { at: 62, x: 13, y: 46, r: 11 },
  { at: 78, x: 33, y: 38, r: 11 },
  { at: 92, x: 20, y: 27, r: 10 },
  { at: 105, x: 38, y: 54, r: 10 },
  { at: 116, x: 7, y: 32, r: 10 },
  { at: 126, x: 27, y: 53, r: 10 },
  { at: 135, x: 40, y: 24, r: 10 },
  { at: 143, x: 15, y: 19, r: 9 },
  { at: 150, x: 30, y: 17, r: 9 },
  { at: 156, x: 5, y: 55, r: 9 },
  { at: 162, x: 23, y: 41, r: 9 },
  { at: 167, x: 39, y: 39, r: 9 },
  { at: 172, x: 9, y: 21, r: 9 },
  { at: 177, x: 25, y: 33, r: 9 },
];

/** SVG path of everything trowelled so far: ragged pixel circles around each hit, merged row by row. */
const patches = (f: number) => {
  let d = '';
  for (let y = 0; y < FLOOR; y++) {
    let start = -1;
    for (let x = 0; x <= VW; x++) {
      const inside =
        x < VW &&
        HITS.some((h) => {
          if (f < h.at) return false;
          const r = h.r * Math.min(1, (f - h.at + 1) / 3);
          const jag = ((x * 7 + y * 13 + h.at) % 5) * 0.5;
          return Math.hypot(x - h.x, (y - h.y) * 0.9) + jag < r;
        });
      if (inside && start < 0) start = x;
      if (!inside && start >= 0) {
        d += `M${start} ${y}h${x - start}v1h-${x - start}z`;
        start = -1;
      }
    }
  }
  return d;
};

/* ---------- 0 – 1.5 s: pick the player before the countdown runs out ---------- */
const Pick: React.FC = () => {
  const f = useCurrentFrame();
  const onYou = f >= 14;
  const picked = f >= T.pick;
  const fall = picked ? f - T.pick : 0;
  const count = 3 - Math.min(2, Math.floor(f / 9));
  const cards = [
    { name: 'PROFÍK', rows: PRO },
    { name: 'VY', rows: picked ? HERO.cheer : HERO.stand },
  ];
  return (
    <AbsoluteFill style={{ background: PAL.k, color: PAL.w, fontFamily: PIXEL_FONT }}>
      <div style={{ position: 'absolute', left: SIDE, right: SIDE, top: 280 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 104, lineHeight: 1.02, fontWeight: 700 }}>
            Kdo udělá
            <br />
            vaši stěnu?
          </div>
          {!picked && <div style={{ fontSize: 200, lineHeight: 0.9, fontWeight: 700, color: PAL.t, transform: `scale(${f % 9 < 2 ? 1.25 : 1})` }}>{count}</div>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '110px 12px 0' }}>
          {cards.map((card, i) => {
            const selected = (i === 1) === onYou;
            const flash = i === 1 && picked && blink(f, 3);
            return (
              <div
                key={card.name}
                style={{
                  position: 'relative',
                  // the professional's card drops off the screen once you are picked
                  transform: i === 0 ? `translateY(${fall * fall * 6}px) rotate(${-fall * 1.2}deg)` : picked ? 'scale(1.06)' : undefined,
                }}
              >
                <Panel fill={DARK} edge={flash ? PAL.y : selected ? PAL.t : DIM} style={{ width: 420, height: 640, display: 'grid', justifyItems: 'center', alignContent: 'center', gap: 34 }}>
                  <Sprite rows={card.rows} outline />
                  <div style={{ fontSize: 76, lineHeight: 1, fontWeight: 700 }}>{card.name}</div>
                </Panel>
                {selected && !picked && (
                  <div style={{ position: 'absolute', left: 190, top: -96 + (blink(f, 5) ? 0 : 14) }}>
                    <Sprite rows={CURSOR} px={12} style={{ transform: 'rotate(90deg)' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {picked && <div style={{ position: 'relative', zIndex: 2, marginTop: 96, fontSize: 124, lineHeight: 1, fontWeight: 700, color: blink(f, 4) ? PAL.y : PAL.w, textShadow: `10px 10px 0 ${PAL.k}` }}>HRAJETE VY!</div>}
      </div>
      {picked && f < T.pick + 3 && <AbsoluteFill style={{ background: PAL.w, opacity: 0.8 }} />}
    </AbsoluteFill>
  );
};

/* ---------- 1.5 – 8 s: smash the grey wall into stucco ---------- */
const Game: React.FC = () => {
  const f = useCurrentFrame();
  const landed = HITS.filter((h) => f >= h.at);
  const combo = landed.length;
  const last = landed[landed.length - 1];
  const since = last ? f - last.at : 99;
  const done = f >= T.done;
  const score = landed.reduce((sum, _, i) => sum + (i + 1) * 10, 0) + (done ? 1000 : 0);
  const percent = done ? 100 : Math.round((combo / HITS.length) * 96);

  // Every hit shakes the screen for a moment
  const shake = !done && since < 4 ? [[-1, 1], [1, -1], [-1, 0], [0, 1]][since] : done && f < T.done + 6 ? [[2, -1], [-2, 1], [1, 2], [-1, -2], [1, 0], [0, 1]][f - T.done] : [0, 0];

  const heroJump = done ? Math.round(Math.abs(Math.sin((f - T.done) / 4)) * 6) : since < 5 ? 3 : 0;

  return (
    <AbsoluteFill style={{ background: PAL.k, fontFamily: PIXEL_FONT, color: PAL.w }}>
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="trowelled" clipPathUnits="userSpaceOnUse">
            <path d={patches(f)} transform={`scale(${P})`} />
          </clipPath>
        </defs>
      </svg>

      <AbsoluteFill style={{ transform: `translate(${shake[0] * 12}px, ${shake[1] * 12}px)` }}>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <Bricks cols={VW} rows={FLOOR} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, clipPath: done ? undefined : 'url(#trowelled)' }}>
          <Stucco cols={VW} rows={FLOOR} seed={1} />
        </div>

        <div style={{ position: 'absolute', left: 0, top: FLOOR * P, width: '100%', height: 18 * P, background: PAL.b, borderTop: `${P}px solid #a5713f` }} />

        {/* The trowel lands, stars fly, points pop */}
        {last && !done && since < 6 && (
          <div style={{ position: 'absolute', left: (last.x - 4) * P, top: (last.y - 2 - (since < 2 ? 2 : 0)) * P }}>
            <Sprite rows={TROWEL} outline style={{ transform: `rotate(${since < 2 ? -30 : 0}deg)` }} />
          </div>
        )}
        {HITS.map((h) => (
          <Burst key={h.at} at={h.at} x={h.x} y={h.y} count={8} reach={8} />
        ))}
        {HITS.map((h, i) => {
          const t = f - h.at;
          if (t < 0 || t > 14 || done) return null;
          return (
            <div
              key={h.at}
              style={{
                position: 'absolute',
                left: Math.min(h.x, 34) * P,
                top: (h.y - 7 - Math.round(t / 3)) * P,
                fontSize: 84 + i * 5,
                lineHeight: 1,
                fontWeight: 700,
                color: PAL.y,
                textShadow: `8px 8px 0 ${PAL.k}`,
                whiteSpace: 'nowrap',
              }}
            >
              +{(i + 1) * 10}
            </div>
          );
        })}

        {/* Player on the floor, hopping with every hit */}
        <div style={{ position: 'absolute', left: 16 * P, top: (FLOOR - 16 - heroJump) * P }}>
          <Sprite rows={done ? HERO.cheer : since < 5 ? HERO.jump : HERO.stand} outline flip={!!last && last.x < 22 && !done} />
        </div>

        {done &&
          [0, 6, 13, 21, 30, 40].map((d, i) => <Burst key={d} at={T.done + d} x={7 + ((i * 13) % 32)} y={38 + ((i * 7) % 18)} count={10} reach={12} />)}
      </AbsoluteFill>

      {/* HUD: score, combo, and how much of the wall is done */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 348, background: PAL.k }}>
        <div style={{ position: 'absolute', left: SIDE, right: SIDE, top: 258, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 54, lineHeight: 1, fontWeight: 500, letterSpacing: '0.04em' }}>
          <span>SKÓRE {String(score).padStart(5, '0')}</span>
          <span style={{ color: combo >= 5 ? PAL.y : PAL.l, fontSize: combo >= 5 ? 68 : 54, fontWeight: 700, transform: `scale(${since < 2 ? 1.25 : 1})`, transformOrigin: 'right bottom' }}>
            {combo > 1 && !done ? `COMBO ×${combo}` : done ? `${percent} %` : ''}
          </span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 348, height: 48, background: '#3a3632', borderBottom: `12px solid ${PAL.k}` }}>
        <div style={{ width: `${percent}%`, height: '100%', background: done ? PAL.y : PAL.t }} />
      </div>

      {/* START! */}
      {f < T.game + 15 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontSize: 250, lineHeight: 1, fontWeight: 700, color: PAL.w, textShadow: `14px 14px 0 ${PAL.t}`, transform: `scale(${f < T.game + 3 ? 1.5 : 1})`, opacity: blink(f, 3) ? 1 : 0.8 }}>
          START!
        </div>
      )}

      {/* Level complete */}
      {done && (
        <>
          <div style={{ position: 'absolute', left: SIDE + 12, right: SIDE + 12, top: 470, color: PAL.k, transform: `scale(${f < T.done + 2 ? 1.6 : f < T.done + 4 ? 1.15 : 1})` }}>
            <Panel style={{ padding: '34px 36px 38px' }}>
              <div style={{ fontSize: 60, lineHeight: 1, fontWeight: 700, letterSpacing: '0.12em', color: PAL.t }}>
                {'★'.repeat(Math.min(3, 1 + Math.floor((f - T.done) / 7)))}
              </div>
              <div style={{ marginTop: 14, fontSize: 118, lineHeight: 0.98, fontWeight: 700 }}>
                LEVEL
                <br />
                COMPLETE
              </div>
              <div style={{ marginTop: 20, fontSize: 60, lineHeight: 1, fontWeight: 600, color: PAL.t }}>Stěna hotová. Sami.</div>
            </Panel>
          </div>
          {f < T.done + 4 && <AbsoluteFill style={{ background: PAL.w, opacity: 0.9 }} />}
        </>
      )}
      {f < T.game + 2 && <AbsoluteFill style={{ background: PAL.w, opacity: 0.9 }} />}
    </AbsoluteFill>
  );
};

export const Mini: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: PAL.k, width: W, height: H, WebkitFontSmoothing: 'antialiased' }}>
      {f < T.game && <Pick />}
      {f >= T.game && f < T.end && <Game />}
      <Sequence from={T.end}>
        <PixelEnd quick />
      </Sequence>
      <BlockDissolve at={T.end - 8} color={PAL.t} />

      {[0, 9, 18].map((t) => (
        <Sfx key={t} at={t} name="blip" volume={0.5} />
      ))}
      <Sfx at={T.pick} name="select" />
      <Sfx at={T.game} name="jump" volume={0.6} />
      {HITS.map((h, i) => (
        <Sfx key={h.at} at={h.at} name={`hit${Math.min(i, 13)}`} />
      ))}
      <Sfx at={T.done} name="fanfare" />
      <Sfx at={T.end + 24} name="select" />
    </AbsoluteFill>
  );
};

export const MINI_FRAMES = T.total;
