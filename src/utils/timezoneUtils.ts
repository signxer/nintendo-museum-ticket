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
 * Convert a Date object which represents Japan Standard Time to the same instant in Local Time.
 * Note: JavaScript Date objects are fundamentally timestamps (UTC). 
 * 
 * 1. Create a date string with timezone: "2026-02-11T14:00:00+09:00"
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
 * Get a list of all supported timezones with formatted labels
 */
export function getAllTimezones(): TimezoneOption[] {
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
      // Get the offset string like "GMT+9" or "GMT-5"
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'shortOffset'
      });
      
      const parts = formatter.formatToParts(now);
      const offsetPart = parts.find(p => p.type === 'timeZoneName');
      let offsetString = offsetPart?.value || ''; 
      
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
      
      // Extract city/region name
      const city = tz.split('/').pop()?.replace(/_/g, ' ') || tz;
      
      return {
        value: tz,
        label: `${city} (${offsetString})`,
        offset
      };
    } catch {
      return null;
    }
  }).filter((item): item is TimezoneOption => item !== null);

  // Sort by offset first, then by name
  return options.sort((a, b) => {
    if (a.offset !== b.offset) return a.offset - b.offset;
    return a.label.localeCompare(b.label);
  });
}
