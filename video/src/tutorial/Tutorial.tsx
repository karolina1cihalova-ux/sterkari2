import type { ReactNode } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { PIXEL_FONT, useFonts } from '../fonts';
import { PixelEnd } from '../pixel/PixelEnd';
import { Sfx } from '../pixel/Sfx';
import { BlockDissolve, Bricks, Burst, CURSOR, GUIDE, HERO, ICON, P, PAL, PRO, Panel, Sprite, Stucco, blink, raggedEdge, typed } from '../pixel/kit';
import { SAFE_TOP, SIDE } from '../theme';

/**
 * "Tutorial mode", 30 s, vertical. A role-playing-game menu: pick the player (you, not a professional),
 * meet the guide, collect the kit, finish the quest. Frames are absolute (30 fps).
 */
const T = { guide: 165, kit: 285, quest: 585, end: 758 };
const ITEM = 72; // frames per item of the kit
const DARK = '#24201d';
const DIM = '#6b655d';

const KIT = [
  { icon: ICON.hodiny, title: ['Individuální', 'workshop'], text: 'Podle náročnosti 2 až 8 hodin' },
  { icon: ICON.naradi, title: ['Zapůjčené', 'nářadí'], text: 'Zdarma, vrátíte ho poštou' },
  { icon: ICON.material, title: ['Materiál', '+ 20 % rezerva'], text: 'Platíte jen materiál, rezerva je zdarma' },
  { icon: ICON.telefon, title: ['Telefonická', 'podpora'], text: 'Během realizace. Nejste na to sami.' },
];

const CHECKS = ['Workshop ve showroomu', 'Materiál a nářadí', 'Realizace svépomocí'];

const Screen: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: PAL.k, color: PAL.w, fontFamily: PIXEL_FONT }}>
    <div style={{ position: 'absolute', left: SIDE, right: SIDE, top: SAFE_TOP + 20 }}>{children}</div>
  </AbsoluteFill>
);

const Heading: React.FC<{ label: string; children: ReactNode; right?: ReactNode }> = ({ label, children, right }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', minHeight: 250 }}>
    <div>
      <div style={{ fontSize: 40, lineHeight: 1, fontWeight: 500, letterSpacing: '0.2em', color: PAL.l }}>{label}</div>
      <div style={{ marginTop: 22, fontSize: 96, lineHeight: 1.02, fontWeight: 700 }}>{children}</div>
    </div>
    {right}
  </div>
);

/* ---------- 0 – 5.5 s: who will do your wall? ---------- */
const Select: React.FC = () => {
  const f = useCurrentFrame();
  const onYou = f >= 62;
  const crossed = f >= 80;
  const confirmed = f >= 100;
  const cards = [
    { name: 'PROFÍK', level: 'LEVEL 99', rows: PRO },
    { name: 'VY', level: 'LEVEL 1', rows: confirmed ? HERO.cheer : HERO.stand },
  ];
  return (
    <Screen>
      <Heading label="NOVÁ HRA">
        {typed('Kdo udělá', f, 6, 0.9)}
        <br />
        {typed('vaši stěnu?', f, 18, 0.9)}
      </Heading>

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '70px 12px 0' }}>
        {cards.map((card, i) => {
          const selected = (i === 1) === onYou && f >= 30;
          const flash = i === 1 && confirmed && f < 114 && blink(f, 4);
          const off = i === 0 && crossed;
          return (
            <div key={card.name} style={{ position: 'relative' }}>
              <Panel fill={DARK} edge={flash ? PAL.y : selected ? PAL.t : DIM} style={{ width: 420, height: 640, display: 'grid', justifyItems: 'center', alignContent: 'center', gap: 30 }}>
                <div style={{ opacity: off ? 0.3 : 1 }}>
                  <Sprite rows={card.rows} outline />
                </div>
                <div style={{ textAlign: 'center', opacity: off ? 0.3 : 1 }}>
                  <div style={{ fontSize: 72, lineHeight: 1, fontWeight: 700 }}>{card.name}</div>
                  <div style={{ marginTop: 14, fontSize: 38, lineHeight: 1, fontWeight: 500, letterSpacing: '0.1em', color: PAL.l }}>{card.level}</div>
                </div>
              </Panel>
              {selected && (
                <div style={{ position: 'absolute', left: 190, top: -92 + (blink(f, 8) ? 0 : 12) }}>
                  <Sprite rows={CURSOR} px={12} style={{ transform: 'rotate(90deg)' }} />
                </div>
              )}
              {off && (
                <Panel fill={PAL.t} edge={PAL.w} style={{ position: 'absolute', left: -6, right: -6, top: 250, padding: '22px 0', textAlign: 'center', fontSize: 48, lineHeight: 1, fontWeight: 600, letterSpacing: '0.04em' }}>
                  NENÍ POTŘEBA
                </Panel>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 84, fontSize: 92, lineHeight: 1, fontWeight: 700, color: PAL.l }}>{typed('To zvládnete sami.', f, 108, 0.9)}</div>
    </Screen>
  );
};

/* ---------- 5.5 – 9.5 s: the guide ---------- */
const Guide: React.FC = () => {
  const f = useCurrentFrame() - T.guide;
  return (
    <Screen>
      <div style={{ position: 'relative', margin: '0 12px' }}>
        <Panel edge={PAL.w}>
          <Stucco cols={38} rows={30} seed={5} />
        </Panel>
        <div style={{ position: 'absolute', left: 216, bottom: 0 }}>
          <Sprite rows={GUIDE} px={36} outline />
        </div>
      </div>

      <Panel edge={PAL.w} style={{ margin: '60px 12px 0', padding: '30px 36px', minHeight: 330, color: PAL.k, position: 'relative' }}>
        <div style={{ fontSize: 40, lineHeight: 1, fontWeight: 500, letterSpacing: '0.14em', color: PAL.t }}>STĚRKAŘI</div>
        <div style={{ marginTop: 18, fontSize: 88, lineHeight: 1.06, fontWeight: 700 }}>
          {typed('My vám', f, 10, 0.8)}
          <br />
          {typed('ukážeme jak.', f, 20, 0.8)}
        </div>
        <div style={{ marginTop: 16, fontSize: 46, fontWeight: 500, color: '#3a3a3a' }}>{typed('Tady je vaše výbava:', f, 62, 1)}</div>
        <span style={{ position: 'absolute', right: 34, bottom: 22, fontSize: 40, color: PAL.t, opacity: f > 84 && blink(f, 10) ? 1 : 0 }}>▼</span>
      </Panel>
    </Screen>
  );
};

/* ---------- 9.5 – 19.5 s: the kit ---------- */
const Kit: React.FC = () => {
  const f = useCurrentFrame() - T.kit;
  const current = Math.min(Math.max(Math.floor((f - 8) / ITEM), -1), KIT.length - 1);
  const since = f - 8 - current * ITEM;
  const item = current >= 0 ? KIT[current] : undefined;
  return (
    <Screen>
      <Heading
        label="INVENTÁŘ"
        right={
          <div style={{ fontSize: 76, lineHeight: 1, fontWeight: 500, color: PAL.l }}>
            {current + 1}/{KIT.length}
          </div>
        }
      >
        Výbava
      </Heading>

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '56px 12px 0' }}>
        {KIT.map((slot, i) => (
          <div key={slot.text} style={{ position: 'relative' }}>
            <Panel fill={DARK} edge={i === current ? PAL.t : DIM} style={{ width: 200, height: 200, display: 'grid', placeItems: 'center' }}>
              {i <= current && <Sprite rows={slot.icon} px={i === current && since < 4 ? 18 : 16} />}
            </Panel>
          </div>
        ))}
      </div>

      {item && (
        <Panel edge={PAL.w} style={{ margin: '64px 12px 0', padding: '40px 40px 44px', color: PAL.k, minHeight: 560 }}>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <Sprite rows={item.icon} px={26} style={{ flex: 'none' }} />
            <div style={{ fontSize: 40, lineHeight: 1, fontWeight: 500, letterSpacing: '0.12em', color: PAL.t }}>
              NOVÝ PŘEDMĚT
            </div>
          </div>
          <div style={{ marginTop: 34, fontSize: 92, lineHeight: 1.04, fontWeight: 700, whiteSpace: 'nowrap' }}>
            {typed(item.title[0], f, 8 + current * ITEM, 1.5)}
            <br />
            {typed(item.title[1], f, 8 + current * ITEM + 8, 1.5)}
          </div>
          <div style={{ marginTop: 22, fontSize: 43, lineHeight: 1.25, fontWeight: 500, color: '#3a3a3a', opacity: since >= 20 ? 1 : 0 }}>{item.text}</div>
        </Panel>
      )}

      {/* Sparkle on the slot that just got filled */}
      {KIT.map((slot, i) => (
        <div key={slot.text} style={{ position: 'absolute', left: -SIDE, top: -(SAFE_TOP + 20) }}>
          <Burst at={T.kit + 8 + i * ITEM} x={(SIDE + 12 + 100 + i * 237) / P - 1} y={(SAFE_TOP + 20 + 250 + 56 + 100) / P - 1} reach={6} />
        </div>
      ))}
    </Screen>
  );
};

/* ---------- 19.5 – 25.3 s: the quest ---------- */
const Quest: React.FC = () => {
  const f = useCurrentFrame() - T.quest;
  const checked = [20, 44, 68].filter((t) => f >= t).length;
  const paint = Math.min(Math.max((f - 78) / 28, 0), 1);
  const done = f >= 108;
  return (
    <Screen>
      <Heading label="QUEST">
        Stěna
        <br />
        svépomocí
      </Heading>

      <Panel edge={PAL.w} style={{ margin: '56px 12px 0', padding: '34px 36px', color: PAL.k, display: 'grid', gap: 26 }}>
        {CHECKS.map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 56, lineHeight: 1, fontWeight: 600, opacity: i <= checked ? 1 : 0.35 }}>
            <span style={{ flex: 'none', width: 72, height: 72, border: `12px solid ${PAL.k}`, background: i < checked ? PAL.t : PAL.w, boxSizing: 'border-box' }} />
            {label}
          </div>
        ))}
      </Panel>

      {/* The wall itself: grey bricks trowelled over into stucco */}
      <div style={{ position: 'relative', margin: '60px 12px 0' }}>
        <Panel edge={PAL.w}>
          <Stucco cols={38} rows={10} seed={2} />
        </Panel>
        {paint < 1 && (
          <div style={{ position: 'absolute', left: 0, top: 0, clipPath: raggedEdge(-6 + paint * 50, 10, 38) }}>
            <Bricks cols={38} rows={10} />
          </div>
        )}
      </div>

      {done && (
        <Panel fill={PAL.t} edge={PAL.w} style={{ margin: '60px 12px 0', padding: '30px 36px' }}>
          <div style={{ fontSize: 96, lineHeight: 1, fontWeight: 700 }}>QUEST SPLNĚN</div>
          <div style={{ marginTop: 14, fontSize: 44, lineHeight: 1, fontWeight: 500, letterSpacing: '0.08em' }}>+1 HOTOVÁ STĚNA</div>
        </Panel>
      )}
      <div style={{ position: 'absolute', left: -SIDE, top: -(SAFE_TOP + 20) }}>
        {[0, 8, 18, 30].map((d, i) => (
          <Burst key={d} at={T.quest + 108 + d} x={8 + i * 9} y={46 + (i % 2) * 5} count={10} reach={8} />
        ))}
      </div>
    </Screen>
  );
};

export const Tutorial: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: PAL.k, WebkitFontSmoothing: 'antialiased' }}>
      {f < T.guide && <Select />}
      {f >= T.guide && f < T.kit && <Guide />}
      {f >= T.kit && f < T.quest && <Kit />}
      {f >= T.quest && f < T.end && <Quest />}
      <Sequence from={T.end}>
        <PixelEnd />
      </Sequence>
      <BlockDissolve at={T.guide - 8} color={PAL.t} />
      <BlockDissolve at={T.kit - 8} color={PAL.t} />
      <BlockDissolve at={T.quest - 8} color={PAL.t} />
      <BlockDissolve at={T.end - 8} color={PAL.t} />

      <Sfx at={30} name="blip" />
      <Sfx at={62} name="blip" />
      <Sfx at={100} name="select" />
      {KIT.map((item, i) => (
        <Sfx key={item.text} at={T.kit + 8 + i * ITEM} name="pickup" />
      ))}
      {[20, 44, 68].map((t) => (
        <Sfx key={t} at={T.quest + t} name="blip" />
      ))}
      <Sfx at={T.quest + 108} name="fanfare" />
      <Sfx at={T.end + 76} name="select" />
    </AbsoluteFill>
  );
};
