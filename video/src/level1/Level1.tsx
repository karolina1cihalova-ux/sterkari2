import type { ReactNode } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { PIXEL_FONT, useFonts } from '../fonts';
import { PixelEnd } from '../pixel/PixelEnd';
import { Sfx } from '../pixel/Sfx';
import { BlockDissolve, Bricks, Burst, HEART, HERO, ICON, P, PAL, Panel, STAR, Sprite, Stucco, TROWEL, VW, blink, raggedEdge, typed } from '../pixel/kit';
import { SIDE } from '../theme';

/**
 * "Level 1: Stěna", 30 s, vertical. A pixel-art platformer where your wall is level 1, not the boss.
 * Frames are absolute (30 fps).
 */
const T = {
  world: 128, // title screen ends (block dissolve 120–136)
  run: 248, // dialog closes, the run starts
  picks: [286, 386, 486], // the three bonuses are picked up
  stop: 572, // the run ends at the wall
  wall: 586, // trowelling starts
  done: 692, // level complete
  end: 758, // end screen (block dissolve 750–766)
};

const FLOOR = 62; // game-pixel row of the floor
const HERO_X = 8;

const FACTS = [
  { icon: ICON.hodiny, title: ['Individuální', 'workshop'], text: 'Podle náročnosti 2 až 8 hodin' },
  { icon: ICON.naradi, title: ['Platíte jen', 'materiál'], text: 'Workshop, nářadí a 20 % rezerva zdarma' },
  { icon: ICON.telefon, title: ['Nejste', 'na to sami'], text: 'Telefonická podpora během realizace' },
];

const at = (x: number, y: number) => ({ position: 'absolute' as const, left: Math.round(x) * P, top: Math.round(y) * P });

/* ---------- 0 – 4.3 s: title screen ---------- */
const Title: React.FC = () => {
  const f = useCurrentFrame();
  const pressed = f >= 108;
  return (
    <AbsoluteFill style={{ background: PAL.k, color: PAL.w, fontFamily: PIXEL_FONT, textAlign: 'center' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 290, fontSize: 40, letterSpacing: '0.24em', color: PAL.E, opacity: f >= 4 ? 1 : 0 }}>
        STĚRKAŘI UVÁDÍ
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 372 + (f < 14 ? Math.round((14 - f) / 2) * -P : 0),
          fontSize: 236,
          lineHeight: 1,
          fontWeight: 700,
          color: PAL.t,
          textShadow: `12px 12px 0 ${PAL.r}`,
          opacity: f >= 8 ? 1 : 0,
        }}
      >
        STĚRKA
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 664, fontSize: 56, color: PAL.w, opacity: f >= 26 ? 1 : 0 }}>Obtížnost:</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 744, fontSize: 88, lineHeight: 1, fontWeight: 700, color: PAL.l }}>
        {typed('VYPADÁ TĚŽCE', f, 34, 0.6)}
      </div>

      {/* A huge grey wall and a small player in front of it */}
      <div style={{ ...at(0, 40) }}>
        <Bricks cols={VW} rows={FLOOR - 40} />
      </div>
      <div style={{ ...at(0, FLOOR), width: '100%', height: 18 * P, background: PAL.b, borderTop: `${P}px solid #a5713f` }} />
      <div style={at(HERO_X, FLOOR - 16)}>
        <Sprite rows={HERO.stand} outline />
      </div>

      <div style={{ position: 'absolute', left: 22 * P, top: 50 * P }}>
        <Panel fill={pressed ? PAL.t : PAL.w} style={{ padding: '22px 34px', fontSize: 52, lineHeight: 1, fontWeight: 600, whiteSpace: 'nowrap', color: pressed ? PAL.w : PAL.k, opacity: f >= 60 && (pressed || blink(f, 14)) ? 1 : 0 }}>
          ▶ PRESS START
        </Panel>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- interface pieces ---------- */
const Hud: React.FC<{ bonus: number }> = ({ bonus }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 348, background: PAL.k, color: PAL.w, fontFamily: PIXEL_FONT }}>
    <div style={{ position: 'absolute', left: SIDE, right: SIDE, top: 262, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 52, lineHeight: 1, fontWeight: 500, letterSpacing: '0.04em' }}>
      <span style={{ display: 'flex', gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <Sprite key={i} rows={HEART} px={12} />
        ))}
      </span>
      <span>LEVEL 1</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Sprite rows={STAR} px={12} />
        {bonus}/3
      </span>
    </div>
  </div>
);

/** Message box under the HUD. */
const Box: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ position: 'absolute', left: SIDE + 12, right: SIDE + 12, top: 396, fontFamily: PIXEL_FONT, color: PAL.k }}>
    <Panel style={{ padding: '30px 34px', minHeight: 300 }}>{children}</Panel>
  </div>
);

/* ---------- 4.3 – 25.3 s: the level ---------- */
const World: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = Math.min(Math.max(f - T.run, 0), T.stop - T.run);
  const running = f >= T.run && f < T.stop;
  const bonus = T.picks.filter((t) => f >= t).length;

  // Wall phase: 0 → 1 while the player trowels
  const progress = Math.min(Math.max((f - T.wall) / (T.done - T.wall), 0), 1);
  const front = -8 + progress * (VW + 14);
  const done = f >= T.done;

  // Player
  const walkIn = Math.min(Math.max((f - 134) / 26, 0), 1);
  let heroX = -14 + walkIn * (HERO_X + 14);
  if (f >= T.wall) heroX = Math.min(Math.max(front - 13, HERO_X), 27);
  let jump = 0;
  for (const t of T.picks) if (Math.abs(f - t) < 12) jump = Math.round(8 * (1 - ((f - t) / 12) ** 2));
  if (done) jump = Math.round(Math.abs(Math.sin((f - T.done) / 5)) * 5);
  const moving = running || (walkIn > 0 && walkIn < 1) || (f >= T.wall && !done && heroX > HERO_X && heroX < 27);
  const pose = done ? HERO.cheer : jump > 0 ? HERO.jump : moving ? (Math.floor(f / 4) % 2 ? HERO.run1 : HERO.run2) : HERO.stand;
  const heroY = FLOOR - 16 - jump;
  const working = f >= T.wall && !done;

  // Which fact is on screen
  const fact = T.picks.findIndex((t, i) => f >= t + 2 && f < (i === 2 ? T.wall - 4 : t + 98));

  return (
    <AbsoluteFill style={{ background: '#9a958c' }}>
      {/* The finished stucco sits under the bricks and shows where they have been trowelled over */}
      {f >= T.wall && (
        <div style={at(0, 0)}>
          <Stucco cols={VW} rows={FLOOR} seed={1} />
        </div>
      )}
      {!done && (
        <div style={{ ...at(0, 0), clipPath: f >= T.wall ? raggedEdge(front, FLOOR, VW) : undefined }}>
          <Bricks cols={VW} rows={FLOOR} scroll={scroll} />
        </div>
      )}

      {/* Floor with plank seams that scroll with the wall */}
      <div style={{ ...at(0, FLOOR), width: '100%', height: 18 * P, background: PAL.b, borderTop: `${P}px solid #a5713f`, overflow: 'hidden' }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: (i * 10 - (scroll % 10)) * P, top: 0, width: P, height: '100%', background: '#75492a' }} />
        ))}
      </div>

      {/* Bonuses float in from the right and are grabbed at the top of a jump */}
      {T.picks.map((t, i) => {
        const x = HERO_X + 1 + (t - f);
        if (f < T.run || f >= t || x > VW) return null;
        return (
          <div key={t} style={at(x - 1, 33 + (Math.floor(f / 8) % 2))}>
            <Panel b={12} style={{ padding: 12 }}>
              <Sprite rows={FACTS[i].icon} />
            </Panel>
          </div>
        );
      })}
      {T.picks.map((t) => (
        <Burst key={t} at={t} x={HERO_X + 6} y={38} />
      ))}

      {/* Player */}
      <div style={at(heroX, heroY)}>
        <Sprite rows={pose} outline />
      </div>
      {working && (
        <div style={at(heroX + 10, heroY - 4 + Math.round(Math.sin(f / 2.2) * 5))}>
          <Sprite rows={TROWEL} outline style={{ transform: 'rotate(90deg)' }} />
        </div>
      )}

      {/* Level complete */}
      {done && (
        <>
          {[0, 9, 18, 30, 42].map((d, i) => (
            <Burst key={d} at={T.done + d} x={8 + ((i * 17) % 30)} y={36 + ((i * 11) % 18)} count={10} reach={11} />
          ))}
          {f < T.done + 4 && <AbsoluteFill style={{ background: PAL.w, opacity: 0.85 }} />}
        </>
      )}

      <Hud bonus={bonus} />

      {/* 4.7 – 8.1 s: the line that sets up the whole video */}
      {f >= 146 && f < T.run - 4 && (
        <Box>
          <div style={{ fontSize: 82, lineHeight: 1.12, fontWeight: 700 }}>
            {typed('Není to boss.', f, 150, 0.8)}
            <div style={{ color: PAL.t }}>{typed('Je to level 1.', f, 180, 0.8)}</div>
          </div>
          <span style={{ position: 'absolute', right: 34, bottom: 22, fontSize: 40, color: PAL.t, opacity: f > 200 && blink(f, 10) ? 1 : 0 }}>▼</span>
        </Box>
      )}

      {/* The fact that came with the bonus */}
      {fact >= 0 && (
        <Box>
          <div style={{ display: 'flex', gap: 34, alignItems: 'center' }}>
            <Sprite rows={FACTS[fact].icon} px={20} style={{ flex: 'none' }} />
            <div>
              <div style={{ fontSize: 38, lineHeight: 1, fontWeight: 500, letterSpacing: '0.08em', color: PAL.t }}>BONUS {fact + 1}/3</div>
              <div style={{ marginTop: 12, fontSize: 78, lineHeight: 1.02, fontWeight: 700 }}>
                {FACTS[fact].title[0]}
                <br />
                {FACTS[fact].title[1]}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 26, fontSize: 39, lineHeight: 1.2, fontWeight: 500, color: '#3a3a3a', whiteSpace: 'nowrap' }}>{FACTS[fact].text}</div>
        </Box>
      )}

      {/* Progress of the wall, then the result */}
      {f >= T.wall - 4 && !done && (
        <Box>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 78, lineHeight: 1, fontWeight: 700 }}>
            <span>STĚNA</span>
            <span style={{ color: PAL.t, fontWeight: 500 }}>{Math.round(progress * 100)}&nbsp;%</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 34, height: 96, padding: 12, background: PAL.k }}>
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i} style={{ flex: 1, background: i < Math.round(progress * 16) ? (i % 5 === 3 ? PAL.q : PAL.c) : '#3a3632' }} />
            ))}
          </div>
          <div style={{ marginTop: 24, fontSize: 39, fontWeight: 500, color: '#3a3a3a' }}>Realizace svépomocí</div>
        </Box>
      )}
      {done && (
        <Box>
          <div style={{ fontSize: 38, lineHeight: 1, fontWeight: 700, letterSpacing: '0.08em', color: PAL.t }}>★ ★ ★</div>
          <div style={{ marginTop: 16, fontSize: 104, lineHeight: 0.98, fontWeight: 700 }}>
            LEVEL
            <br />
            COMPLETE
          </div>
          <div style={{ marginTop: 20, fontSize: 52, fontWeight: 600, color: PAL.t }}>Stěna hotová.</div>
        </Box>
      )}
    </AbsoluteFill>
  );
};

export const Level1: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: PAL.k, WebkitFontSmoothing: 'antialiased' }}>
      {f < T.world && <Title />}
      {f >= T.world && f < T.end && <World />}
      <Sequence from={T.end}>
        <PixelEnd />
      </Sequence>
      <BlockDissolve at={T.world - 8} />
      <BlockDissolve at={T.end - 8} color={PAL.t} />

      <Sfx at={108} name="select" />
      {T.picks.map((t) => (
        <Sfx key={t} at={t - 11} name="jump" volume={0.5} />
      ))}
      {T.picks.map((t) => (
        <Sfx key={`p${t}`} at={t} name="pickup" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <Sfx key={`s${i}`} at={T.wall + i * 13} name="stroke" volume={0.5} />
      ))}
      <Sfx at={T.done} name="fanfare" />
      <Sfx at={T.end + 76} name="select" />
    </AbsoluteFill>
  );
};
