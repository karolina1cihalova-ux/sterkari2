import '@fontsource-variable/dm-sans';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/pixelify-sans';
import { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';

export const PIXEL_FONT = '"Pixelify Sans Variable", "Pixelify Sans", monospace';
export const STORY_FONT = '"Fraunces Variable", "Fraunces", Georgia, serif';

const FAMILIES = ['DM Sans Variable', 'Pixelify Sans Variable', 'Fraunces Variable'];

/** Holds rendering until every font (latin + latin-ext for Czech) is ready. */
export const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(FAMILIES.map((family) => document.fonts.load(`700 100px "${family}"`, 'Stěrkaři abc')))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle));
  }, [handle]);
};
