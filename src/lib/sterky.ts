/**
 * Real structures (Inspirace entries with a cover photo and no generated `structure`)
 * and the rooms they fit. Used by the Stěrky section, the header dropdown and the booking form.
 */
import { getCollection } from 'astro:content';
import { STERKY_ROOMS, type SterkyRoomId } from '../data/sterky';

export async function getSterky() {
  return (await getCollection('inspirace'))
    .filter((e) => e.data.cover && !e.data.structure)
    .sort((a, b) => a.data.order - b.data.order);
}

/** Rooms that have at least one structure, in STERKY_ROOMS order */
export async function sterkyRooms() {
  const items = await getSterky();
  return (Object.keys(STERKY_ROOMS) as SterkyRoomId[])
    .map((id) => ({ id, label: STERKY_ROOMS[id], count: items.filter((i) => i.data.fits.includes(id)).length }))
    .filter((r) => r.count > 0);
}
