import { Img, useCurrentFrame } from 'remotion';
import { PHOTO } from '../photos';
import { C, EASE_IN_OUT, EASE_SHEEN, SAFE_TOP, SHADOW_CARD, SHADOW_LIFT, SHADOW_REST, SIDE, tween } from '../theme';
import { Arrow, Line, PaperWipe, Rise } from '../ui';

/** 24.8 – 30 s: end card with the hero headline of the site and the call to action. */
const SWATCHES = [PHOTO.skala, PHOTO.metamorfica, PHOTO.rozpraskana, PHOTO.oxidace, PHOTO.plech];
const HOVER = 92; // the button "gets hovered": lifts, sheen sweeps across, arrow nudges

export const End: React.FC = () => {
  const f = useCurrentFrame();
  const lift = tween(f, HOVER, HOVER + 8, [0, 1], EASE_IN_OUT);
  const sheen = tween(f, HOVER, HOVER + 27, [135, -35], EASE_SHEEN);

  return (
    <PaperWipe>
      <div style={{ position: 'absolute', left: SIDE, right: SIDE, top: SAFE_TOP + 10 }}>
        <div style={{ fontSize: 64, lineHeight: 1, fontWeight: 800, letterSpacing: '-0.04em', color: '#000' }}>
          <Line at={14}>STĚRKAŘI.</Line>
        </div>

        <h1 style={{ margin: '84px 0 0', fontSize: 136, lineHeight: 1.03, fontWeight: 700, letterSpacing: '-0.03em', color: C.ink }}>
          <Line at={20}>Stěrku</Line>
          <Line at={24}>zvládnete</Line>
          <Line at={28}>sami.</Line>
          <span style={{ color: C.accent }}>
            <Line at={38}>My vám</Line>
            <Line at={42}>ukážeme jak.</Line>
          </span>
        </h1>

        {/* The five real walls from Inspirace */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 66 }}>
          {SWATCHES.map((src, i) => {
            const at = 54 + i * 3;
            const p = tween(f, at, at + 18, [0, 1]);
            return (
              <div
                key={src}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 22,
                  overflow: 'hidden',
                  boxShadow: SHADOW_CARD,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + 0.1 * p})`,
                }}
              >
                <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.5)' }} />
              </div>
            );
          })}
        </div>

        <Rise at={70} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 62 }}>
          {/* .btn.btn-dark from the site */}
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
          <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.02em', color: C.ink }}>sterkari.cz</span>
        </Rise>

        <Rise at={78} style={{ marginTop: 34, fontSize: 38, lineHeight: 1.3, fontWeight: 500, color: C.body }}>
          Showroom Praha a&nbsp;Valašské Meziříčí
        </Rise>
      </div>
    </PaperWipe>
  );
};
