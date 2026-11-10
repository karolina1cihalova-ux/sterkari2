/**
 * Czech typography: single-letter words (a, i, k, o, s, u, v, z) must never end a line.
 * cz() glues them to the next word with a non-breaking space.
 */
export function cz(text: string): string {
  return text.replace(/(?<=^|[\s (])([aikosuvzAIKOSUVZ]) /g, '$1 ');
}

export type Structure = {
  id: string;
  name: string;
  look: string;
  rooms: string;
  level: 1 | 2 | 3;
  desc: string;
};

export type Shade = { id: string; name: string; hex: string };

// Descriptions are a draft: adjust to the techniques actually taught at the workshop.
export const STRUCTURES: Structure[] = [
  {
    id: 'benatsky',
    name: 'Benátský štuk',
    look: 'lesklý, hloubka mramoru',
    rooms: 'obývák, ložnice, chodba',
    level: 3,
    desc: cz('Hladký, lesklý povrch s hloubkou mramoru. Nanáší se v tenkých vrstvách a na závěr se hladítkem vyleští.'),
  },
  {
    id: 'beton',
    name: 'Betonová stěrka',
    look: 'matný, jemné póry',
    rooms: 'obývák, kuchyň, chodba',
    level: 2,
    desc: cz('Industriální vzhled pohledového betonu s jemnými póry a mapováním. Působí syrově, ale na dotek je příjemná.'),
  },
  {
    id: 'mikrocement',
    name: 'Mikrocement',
    look: 'saténový, souvislý',
    rooms: 'koupelna, kuchyň, obývák',
    level: 2,
    desc: cz('Velmi tenká souvislá vrstva bez spár. Klidný, čistý povrch, který s ochranným lakem vydrží i v koupelně.'),
  },
  {
    id: 'vapenna',
    name: 'Vápenná stěrka',
    look: 'matný, měkké mramorování',
    rooms: 'ložnice, obývák, dětský pokoj',
    level: 1,
    desc: cz('Matný, prodyšný povrch s měkkým mramorováním. Pomáhá regulovat vlhkost a dobře stárne.'),
  },
  {
    id: 'tadelakt',
    name: 'Tadelakt',
    look: 'hedvábný lesk',
    rooms: 'koupelna, sprchový kout',
    level: 3,
    desc: cz('Tradiční marocká vápenná technika. Povrch se zhutní kamenem a ošetří mýdlem, takže odolává vodě.'),
  },
  {
    id: 'hlinena',
    name: 'Hliněná omítka',
    look: 'zrnitý mat',
    rooms: 'ložnice, obývák',
    level: 1,
    desc: cz('Teplá zrnitá textura z přírodní hlíny a písku. Nejvíc ruční ze všech, každá stěna je trochu jiná.'),
  },
];

export const SHADES: Shade[] = [
  { id: 'piskova', name: 'Písková', hex: '#D4C4A8' },
  { id: 'mlha', name: 'Šedá mlha', hex: '#B8BCC4' },
  { id: 'oliva', name: 'Olivová hlína', hex: '#8A8F6E' },
  { id: 'krida', name: 'Bílá křída', hex: '#EEEBE5' },
  { id: 'terakota', name: 'Teplá terakota', hex: '#C4785A' },
  { id: 'antracit', name: 'Antracit', hex: '#454545' },
];

export const LEVEL_LABEL = ['', 'snadná', 'střední', 'náročnější'] as const;

// Rooms used to filter the Inspirace section. Installations themselves live in src/content/inspirace/.
export const ROOMS = {
  obyvak: 'Obývák',
  koupelna: 'Koupelna',
  chodba: 'Chodba',
} as const;
export type RoomId = keyof typeof ROOMS;

export const structureById = (id: string) => STRUCTURES.find((s) => s.id === id)!;
export const shadeById = (id: string) => SHADES.find((s) => s.id === id)!;

// Links start with "/" so they also work from subpages (e.g. an installation detail).
export const NAV = [
  { href: '/#inspirace', label: 'Inspirace' },
  { href: '/#workshop', label: 'Workshop' },
  { href: '/#jak-to-funguje', label: 'Jak to funguje' },
  { href: '/#sterky', label: 'Stěrky' },
  { href: '/#o-nas', label: 'O nás' },
];
