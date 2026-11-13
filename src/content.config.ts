import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Inspirace: one Markdown file per installation in src/content/inspirace/.
 * The file name becomes the page address: koupelna-bila-krida.md → /inspirace/koupelna-bila-krida/
 *
 * Photos: put them next to the .md file (or in src/assets/) and reference them, e.g.
 *   cover: ./koupelna-bila-krida/cover.jpg
 *   gallery: [./koupelna-bila-krida/1.jpg, ./koupelna-bila-krida/2.jpg]
 * Until a cover exists, a generated texture in the chosen structure and shade is shown.
 */
const inspirace = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/inspirace' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Optional: without a room the installation shows only under "Vše" */
      room: z.enum(['obyvak', 'koupelna', 'chodba']).optional(),
      structure: z.enum(['benatsky', 'beton', 'mikrocement', 'vapenna', 'tadelakt', 'hlinena']).optional(),
      shade: z.enum(['piskova', 'mlha', 'oliva', 'krida', 'terakota', 'antracit']).optional(),
      summary: z.string(),
      /** Náročnost 1–3 (snadná / střední / náročnější), shown in Stěrky */
      level: z.number().int().min(1).max(3).optional(),
      /** "Kam se hodí", shown in Stěrky, e.g. "Obývák, chodba, kanceláře" */
      suits: z.string().optional(),
      place: z.string().optional(),
      area: z.string().optional(),
      duration: z.string().optional(),
      cover: image().optional(),
      gallery: z.array(image()).default([]),
      order: z.number().default(100),
      /** true = placeholder text and photos, shown with a notice on the page */
      sample: z.boolean().default(false),
    }),
});

export const collections = { inspirace };
