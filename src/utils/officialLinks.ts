/**
 * Official Nintendo Museum ticket site links.
 *
 * The ticket site (museum-tickets.nintendo.com) serves Japanese at the root —
 * `https://museum-tickets.nintendo.com/calendar` — and English under /en/.
 * Other language paths (e.g. /ja/calendar, /zh-tw/calendar) currently return
 * 404 and the site's language switch is client-side, so we deep-link Japanese
 * users to the root calendar and everyone else to the English one.
 */
export const OFFICIAL_CALENDAR_EN = 'https://museum-tickets.nintendo.com/en/calendar';
export const OFFICIAL_CALENDAR_JA = 'https://museum-tickets.nintendo.com/calendar';

/** Pick the official calendar URL for the active UI language. */
export function getOfficialCalendarUrl(language: string): string {
  const primary = (language || '').toLowerCase().split('-')[0];
  return primary === 'ja' ? OFFICIAL_CALENDAR_JA : OFFICIAL_CALENDAR_EN;
}
