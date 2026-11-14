import { Audio, Sequence, staticFile } from 'remotion';

/** Plays one generated 8-bit effect from public/sfx/ (see sfx.mjs) at an absolute frame. */
export const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 0.7 }) => (
  <Sequence from={at} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
