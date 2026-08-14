/**
 * Japan Standard Time (JST) Offset in minutes (UTC+9)
 */
export const JST_OFFSET = 9 * 60;

/**
 * Get the current user's timezone
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * The museum operates on Japan Standard Time, so "which month is it right now"
 * must be answered in JST — not the device's local time (a user in the Americas
 * can lag JST by up to 19 hours around a month boundary).
 *
 * Returns a Date whose year/month are the current JST year/month (day = 1st,
 * local clock is irrelevant — only getFullYear/getMonth are consumed).
 */
export function getJSTMonth(date: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === 'year')?.value);
  const month = Number(parts.find((p) => p.type === 'month')?.value) - 1;
  return new Date(year, month, 1);
}

/**
 * Convert a Date object which represents Japan Standard Time to the same instant in Local Time.
 * Note: JavaScript Date objects are fundamentally timestamps (UTC). 
 * 
 * 1. Create a date string with timezone: "2026-02-11T16:00:00+09:00"
 * 2. Parse it into a Date object (browser handles conversion).
 */
export function getJSTDate(year: number, month: number, day: number, hour: number, minute: number): Date {
  // Pad function
  const p = (n: number) => n.toString().padStart(2, '0');
  
  // Create ISO string with offset +09:00 (JST)
  // Month is 0-indexed in arguments, but 1-indexed in ISO string
  const isoString = `${year}-${p(month + 1)}-${p(day)}T${p(hour)}:${p(minute)}:00+09:00`;
  
  return new Date(isoString);
}

export interface TimezoneOption {
  value: string;
  label: string;
  offset: number;
}

/**
 * Get a list of all supported timezones with localized labels.
 * @param locale The display locale (e.g. "zh-CN") — zone names are localized
 *               via Intl so the dropdown reads naturally in any language.
 */
/**
 * Canonical zones to prefer when several IANA zones collapse to the same
 * localized label (e.g. all China zones → "中国标准时间"), so the option that
 * survives carries a clean, well-known timezone value.
 *
 * Also used as the "common zones" shortcut list in the timezone picker.
 */
export const PREFERRED_ZONES = new Set([
  'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Hong_Kong', 'Asia/Taipei', 'Asia/Seoul',
  'Asia/Singapore', 'Asia/Kolkata', 'Asia/Dubai', 'Asia/Bangkok', 'Asia/Jakarta',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Rome',
  'Europe/Amsterdam', 'Europe/Istanbul', 'Europe/Moscow',
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Toronto', 'America/Vancouver', 'America/Sao_Paulo', 'America/Mexico_City',
  'Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Pacific/Auckland',
  'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos',
]);

export function getAllTimezones(locale: string = 'en'): TimezoneOption[] {
  // Fallback if supportedValuesOf is not available
  if (typeof Intl === 'undefined' || !('supportedValuesOf' in Intl)) {
    return [
      { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)', offset: 9 },
      { value: 'Asia/Shanghai', label: 'Shanghai (UTC+8)', offset: 8 },
      { value: 'America/New_York', label: 'New York (UTC-5)', offset: -5 },
      { value: 'Europe/London', label: 'London (UTC+0)', offset: 0 },
    ];
  }

  const timezones = Intl.supportedValuesOf('timeZone');
  const now = new Date();

  const options = timezones.map(tz => {
    try {
      // Localized long zone name, e.g. "中国标准时间" / "China Standard Time".
      const nameFormatter = new Intl.DateTimeFormat(locale, {
        timeZone: tz,
        timeZoneName: 'long'
      });
      const name = nameFormatter.formatToParts(now).find(p => p.type === 'timeZoneName')?.value
        || tz.split('/').pop()?.replace(/_/g, ' ')
        || tz;

      // Offset string like "GMT+9" or "GMT-5"
      const offsetFormatter = new Intl.DateTimeFormat(locale, {
        timeZone: tz,
        timeZoneName: 'shortOffset'
      });
      let offsetString = offsetFormatter.formatToParts(now).find(p => p.type === 'timeZoneName')?.value || '';

      // Standardize to UTC
      offsetString = offsetString.replace('GMT', 'UTC');
      if (offsetString === 'UTC') offsetString = 'UTC+0';

      // Calculate numeric offset for sorting (approximate)
      let offset = 0;
      if (offsetString.includes('+')) {
        const [, num] = offsetString.split('+');
        offset = parseInt(num) || 0;
      } else if (offsetString.includes('-')) {
        const [, num] = offsetString.split('-');
        offset = -(parseInt(num) || 0);
      }

      return {
        value: tz,
        label: `${name} (${offsetString})`,
        offset
      };
    } catch {
      return null;
    }
  }).filter((item): item is TimezoneOption => item !== null);

  // Collapse exact duplicates: many zones share the same localized name + offset
  // (e.g. every China zone → "中国标准时间 (UTC+8)"). Prefer a canonical zone
  // (like Asia/Shanghai) whenever one of the colliding values is preferred.
  const seen = new Map<string, TimezoneOption>();
  for (const opt of options) {
    const existing = seen.get(opt.label);
    if (!existing || (PREFERRED_ZONES.has(opt.value) && !PREFERRED_ZONES.has(existing.value))) {
      seen.set(opt.label, opt);
    }
  }
  const unique = [...seen.values()];

  // Sort by offset first, then by localized name
  return unique.sort((a, b) => {
    if (a.offset !== b.offset) return a.offset - b.offset;
    return a.label.localeCompare(b.label, locale);
  });
}
