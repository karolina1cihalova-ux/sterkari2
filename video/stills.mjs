// Renders single frames for a quick look: node stills.mjs Level1 30 120 400
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const [id, ...rest] = process.argv.slice(2);
const frames = rest.map(Number);
const scale = Number(process.env.SCALE ?? 0.4);

const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id });
for (const frame of frames) {
  const output = path.resolve('out/stills', `${id}-${String(frame).padStart(4, '0')}.jpg`);
  await renderStill({ composition, serveUrl, frame, output, imageFormat: 'jpeg', jpegQuality: 88, scale });
  console.log(output);
}
