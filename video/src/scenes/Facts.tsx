import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { NAME, PHOTO } from '../photos';
import { C, EASE_IN_OUT, H, SAFE_BOTTOM, SAFE_TOP, SHADOW_CARD, SHADOW_FLOAT, SIDE, W, tween } from '../theme';
import { Line, Photo, Rise, Tag } from '../ui';

/**
 * 9.9 – 24.8 s: three facts from the hero of the site, each with a photo in a card.
 * The last photo (work on a real wall) then grows to fill the screen for the workshop line.
 */
const FACT = 105; // frames per fact
const GROW = 3 * FACT; // the card starts growing to full screen here
const GROW_LEN = 26;

// Line icons from Hero.astro (24×24)
const ICON = {
  hodiny: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
  material: (
    <>
      <path d="M3.5 7.6 12 3.2l8.5 4.4v8.8L12 20.8l-8.5-4.4z" />
      <path d="M3.5 7.6 12 12l8.5-4.4M12 12v8.8M7.8 5.4l8.5 4.4" />
    </>
  ),
  telefon: (
    <path d="M5.2 3.5h3.3l1.7 4.2-2.2 1.4a11.5 11.5 0 0 0 6.9 6.9l1.4-2.2 4.2 1.7v3.3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3.2 5.6a2 2 0 0 1 2-2.1z" />
  ),
};

const FACTS = [
  {
    title: ['Individuální', 'workshop'],
    text: 'Podle náročnosti 2 až 8 hodin',
    icon: ICON.hodiny,
    photo: PHOTO.oxidace,
    tag: NAME.oxidace,
    position: '50% 40%',
  },
  {
    title: ['Platíte jen', 'materiál'],
    text: 'Workshop, nářadí a 20 % rezerva zdarma',
    icon: ICON.material,
    photo: PHOTO.plech,
    tag: NAME.plech,
    position: '50% 38%',
  },
  {
    title: ['Nejste', 'na to sami'],
    text: 'Telefonická podpora během realizace',
    icon: ICON.telefon,
    photo: PHOTO.priPraci,
    tag: undefined,
    // x matters once the card is taller than the photo (full screen), y while it is wider (card)
    position: '64% 10%',
  },
];

// Card with the photo, in its resting place
const CARD = { left: SIDE, top: SAFE_TOP, width: W - 2 * SIDE, height: 720, radius: 28 };
const TEXT_TOP = CARD.top + CARD.height + 62;

export const Facts: React.FC = () => {
  const f = useCurrentFrame();

  // 0 = card, 1 = full screen
  const grow = tween(f, GROW, GROW + GROW_LEN, [0, 1], EASE_IN_OUT);
  const cardIn = tween(f, 0, 24, [0, 1]);
  const box = {
    left: CARD.left * (1 - grow),
    top: CARD.top * (1 - grow) + (1 - cardIn) * 70,
    width: CARD.width + (W - CARD.width) * grow,
    height: CARD.height + (H - CARD.height) * grow,
    borderRadius: CARD.radius * (1 - grow),
  };

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      {/* Numbered facts under the card */}
      <div style={{ position: 'absolute', left: SIDE, right: SIDE, top: TEXT_TOP, opacity: 1 - tween(f, GROW, GROW + 8, [0, 1]) }}>
        {/* Ink rule above the number, as on the "Jak to funguje" steps */}
        <div
          style={{
            height: 6,
            background: C.ink,
            transform: `scaleX(${tween(f, 8, 34, [0, 1])})`,
            transformOrigin: 'left center',
          }}
        />

        <div style={{ position: 'relative', height: 480 }}>
          {FACTS.map((fact, i) => {
            const start = i * FACT;
            const out = start + FACT - 13;
            if (f < start || f > start + FACT + 4) return null;
            return (
              <div key={fact.text} style={{ position: 'absolute', inset: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 }}>
                  <span style={{ fontSize: 132, lineHeight: 1, fontWeight: 700, letterSpacing: '-0.02em', color: C.accent, fontVariantNumeric: 'tabular-nums' }}>
                    <Line at={start + 6} out={out}>
                      {i + 1}
                    </Line>
                  </span>
                  <Rise at={start + 12} out={out + 2} y={20}>
                    <span
                      style={{
                        display: 'grid',
                        placeItems: 'center',
                        width: 124,
                        height: 124,
                        borderRadius: 22,
                        background: C.white,
                        color: C.accent,
                        boxShadow: SHADOW_CARD,
                      }}
                    >
                      <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                        {fact.icon}
                      </svg>
                    </span>
                  </Rise>
                </div>

                <h2 style={{ margin: '34px 0 0', fontSize: 96, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.03em', color: C.ink }}>
                  <Line at={start + 10} out={out + 1}>
                    {fact.title[0]}
                  </Line>
                  <Line at={start + 14} out={out + 2}>
                    {fact.title[1]}
                  </Line>
                </h2>

                <p style={{ margin: '26px 0 0', fontSize: 46, lineHeight: 1.3, fontWeight: 500, color: C.body }}>
                  <Line at={start + 20} out={out + 3}>
                    {fact.text}
                  </Line>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Photo card; at the end it grows into the full-screen picture */}
      <div
        style={{
          position: 'absolute',
          ...box,
          overflow: 'hidden',
          opacity: cardIn,
          boxShadow: grow < 1 ? SHADOW_FLOAT : undefined,
          background: C.stone,
        }}
      >
        {FACTS.map((fact, i) => {
          const start = i * FACT;
          const hidden = i === 0 ? 0 : tween(f, start - 2, start + 18, [100, 0], EASE_IN_OUT);
          if (hidden === 100) return null;
          const last = i === FACTS.length - 1;
          return (
            <AbsoluteFill key={fact.text} style={{ clipPath: `inset(${hidden}% 0 0 0)` }}>
              <Photo
                src={fact.photo}
                span={[start - 2, last ? GROW + 150 : start + FACT + 20]}
                scale={last ? [1.02, 1.12] : [1.04, 1.16]}
                position={fact.position}
                origin={last ? '55% 30%' : '50% 50%'}
              />
              {fact.tag && (
                <div style={{ position: 'absolute', left: 30, bottom: 30 }}>
                  <Line at={start + 16} out={start + FACT - 12} style={{ borderRadius: 999 }}>
                    <Tag>{fact.tag}</Tag>
                  </Line>
                </div>
              )}
            </AbsoluteFill>
          );
        })}

        {/* Warm dark fade for the white text once the photo is full screen */}
        <AbsoluteFill
          style={{
            opacity: grow,
            background:
              'linear-gradient(to top, rgb(22 15 10 / 0.9) 0%, rgb(22 15 10 / 0.7) 30%, rgb(22 15 10 / 0.2) 56%, rgb(22 15 10 / 0) 70%)',
          }}
        />
      </div>

      {/* 20.4 – 24.8 s: line from the Workshop section over the full-screen photo */}
      <div style={{ position: 'absolute', left: SIDE, right: SIDE, bottom: SAFE_BOTTOM, color: C.white }}>
        <h2 style={{ margin: 0, fontSize: 132, lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.03em' }}>
          <Line at={GROW + 16}>Žádná teorie.</Line>
        </h2>
        <p style={{ margin: '30px 0 0', fontSize: 62, lineHeight: 1.22, fontWeight: 500, letterSpacing: '-0.01em', color: 'rgb(255 255 255 / 0.92)' }}>
          <Line at={GROW + 26}>Odcházíte s&nbsp;rukama,</Line>
          <Line at={GROW + 30}>které už stěrku znají.</Line>
        </p>
      </div>
    </AbsoluteFill>
  );
};
