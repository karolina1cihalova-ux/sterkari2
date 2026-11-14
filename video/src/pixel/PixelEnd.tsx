import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PIXEL_FONT } from '../fonts';
import { C, FONT, SAFE_TOP, SIDE } from '../theme';
import { HERO, P, PAL, Panel, Sprite, Stucco, blink, typed } from './kit';

/**
 * End screen of the two game-style videos: hero headline of the site (typed out),
 * the finished wall with the player on top, and the call to action as a game button.
 * Frames are relative to the scene (wrap it in a Sequence).
 * `quick` fits everything into about a second (for the 10 s video).
 */
export const PixelEnd: React.FC<{ quick?: boolean }> = ({ quick = false }) => {
  const f = useCurrentFrame();
  const line1 = 'Stěrku zvládnete sami.';
  const line2 = 'My vám ukážeme jak.';
  const at = quick ? { logo: 0, t1: 4, t2: 13, speed: 3, wall: 18, button: 24 } : { logo: 8, t1: 16, t2: 40, speed: 1.2, wall: 58, button: 76 };
  const t1 = typed(line1, f, at.t1, at.speed);
  const t2 = typed(line2, f, at.t2, at.speed);
  const hop = f > at.wall + 6 ? Math.round(Math.abs(Math.sin((f - at.wall - 6) / 5)) * 3) * (P / 2) : 0;

  return (
    <AbsoluteFill style={{ background: C.paper, color: C.ink }}>
      <div style={{ position: 'absolute', left: SIDE, right: SIDE, top: SAFE_TOP + 10 }}>
        <div style={{ fontFamily: FONT, fontSize: 64, lineHeight: 1, fontWeight: 800, letterSpacing: '-0.04em', color: '#000', opacity: f >= at.logo ? 1 : 0 }}>
          STĚRKAŘI.
        </div>

        {/* Fixed height, so nothing below moves while the text is typed */}
        <h1 style={{ margin: '76px 0 0', height: 640, fontFamily: FONT, fontSize: 122, lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.03em', width: 780 }}>
          {t1}
          <span style={{ display: 'block', color: C.accent }}>{t2}</span>
        </h1>

        {/* The finished wall, with the player celebrating on top */}
        <div style={{ position: 'relative', marginTop: 70, opacity: f >= at.wall ? 1 : 0 }}>
          <div style={{ position: 'absolute', right: 0, bottom: '100%', marginBottom: 12 + hop }}>
            <Sprite rows={f > at.wall + 6 ? HERO.cheer : HERO.stand} px={P / 2} outline />
          </div>
          <Panel b={12} style={{ margin: '0 12px' }}>
            <Stucco cols={38} rows={9} seed={3} style={{ width: '100%', height: 9 * P }} />
          </Panel>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 64, opacity: f >= at.button ? 1 : 0, fontFamily: PIXEL_FONT }}>
          <Panel fill={PAL.k} b={12} style={{ margin: '0 12px', padding: '26px 34px', display: 'flex', alignItems: 'center', gap: 22 }}>
            <span style={{ color: PAL.l, fontSize: 40, opacity: blink(f, 12) ? 1 : 0 }}>▶</span>
            <span style={{ color: PAL.w, fontSize: 46, lineHeight: 1, fontWeight: 600, letterSpacing: '0.04em' }}>CHCI NA WORKSHOP</span>
          </Panel>
          <span style={{ fontSize: 50, fontWeight: 600 }}>sterkari.cz</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
