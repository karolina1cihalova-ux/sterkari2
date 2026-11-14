import { Easing, interpolate } from 'remotion';

/** Brand tokens, copied from src/styles/global.css of the site. */
export const C = {
  paper: '#f7f4ef',
  ink: '#1a1a1a',
  body: '#525252',
  muted: '#8c8780',
  line: '#e6e1d8',
  stone: '#d9d3c9',
  accent: '#c45c26',
  accentLight: '#e8a37f', // arrow colour on dark buttons
  white: '#ffffff',
};

export const FONT = '"DM Sans Variable", "DM Sans", system-ui, sans-serif';

/** The site's curves: strong ease-out for entrances, ease-in-out for on-screen movement. */
export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
export const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
export const EASE_SHEEN = Easing.bezier(0.55, 0.05, 0.25, 1);

/** Warm brown shadows, scaled up from the site (the video canvas is ~2.8× a phone screen). */
export const SHADOW_CARD = '0 3px 6px rgb(60 40 25 / 0.06), 0 18px 46px -22px rgb(60 40 25 / 0.22)';
export const SHADOW_FLOAT = '0 6px 12px rgb(60 40 25 / 0.06), 0 62px 124px -62px rgb(70 45 25 / 0.42)';
export const SHADOW_REST = '0 3px 6px rgb(60 40 25 / 0.10), 0 12px 28px -16px rgb(60 40 25 / 0.25)';
export const SHADOW_LIFT = '0 6px 12px rgb(60 40 25 / 0.08), 0 40px 72px -34px rgb(70 45 25 / 0.45)';

/** Canvas and safe area (keeps text clear of the Reels / TikTok / Shorts interface). */
export const W = 1080;
export const H = 1920;
export const SIDE = 72;
export const SAFE_TOP = 260;
export const SAFE_BOTTOM = 380;

/** Clamped interpolate between two frames. */
export const tween = (
  frame: number,
  from: number,
  to: number,
  range: [number, number],
  easing: (t: number) => number = EASE_OUT,
) =>
  interpolate(frame, [from, to], range, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Timeline in frames (30 fps, 900 frames = 30 s). */
export const FPS = 30;
export const T = {
  hook: 0, // textures + "Vypadá to jako práce pro profíka."
  turn: 192, // "Není. Zvládnete to sami."
  facts: 297, // three facts, then the photo grows to full screen
  end: 744, // end card
  total: 900,
};
export const WIPE = 22; // length of the paper wipe between scenes
