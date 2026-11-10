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

export type InspiraceItem = {
  room: 'obyvak' | 'koupelna' | 'chodba';
  label: string;
  title: string;
  structure: string;
  shade: number;
};

// Illustrative examples until real client photos exist.
export const INSPIRACE: InspiraceItem[] = [
  { room: 'obyvak', label: 'Obývák', title: 'Obývák — teplá písková stěna', structure: 'vapenna', shade: 0 },
  { room: 'koupelna', label: 'Koupelna', title: 'Koupelna — bílá křída', structure: 'tadelakt', shade: 3 },
  { room: 'chodba', label: 'Chodba', title: 'Chodba — antracitový pruh', structure: 'beton', shade: 5 },
  { room: 'obyvak', label: 'Obývák', title: 'Obývák — olivová hlína', structure: 'hlinena', shade: 2 },
  { room: 'koupelna', label: 'Koupelna', title: 'Koupelna — šedá mlha', structure: 'mikrocement', shade: 1 },
  { room: 'chodba', label: 'Chodba', title: 'Chodba — písková s dřevěnou lištou', structure: 'benatsky', shade: 0 },
];

export const NAV = [
  { href: '#sterky', label: 'Stěrky' },
  { href: '#workshop', label: 'Workshop' },
  { href: '#jak-to-funguje', label: 'Jak to funguje' },
  { href: '#inspirace', label: 'Inspirace' },
  { href: '#o-nas', label: 'O nás' },
];
