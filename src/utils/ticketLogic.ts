import { addMonths, startOfMonth, subMonths } from 'date-fns';
import { calcSecondWednesday } from './dateHelper';
import { getJSTDate } from './timezoneUtils';

export interface ReleaseInfo {
  releaseDate: Date; // The exact Date object (in local time) when tickets are released
  forMonth: Date;    // The month for which tickets are being sold (start of month)
}

/**
 * Verified first-come (先着順) ticket sales, keyed by the *visit* month — i.e. the
 * month the tickets are for. Each value is the exact JST sale-start time from the
 * official @Museum_Nintendo announcements.
 *
 * Months absent from this table fall back to the heuristic rule below, because the
 * official schedule occasionally deviates (e.g. May 2026 tickets went on sale on the
 * 2nd Thursday in the morning, not the 2nd Wednesday).
 *
 * Source: @Museum_Nintendo tweets (2025-07 onward), times in JST.
 */
const KNOWN_RELEASES: Record<string, string> = {
  '2026-10': '2026-08-12T17:00:00+09:00',
  '2026-09': '2026-07-08T17:00:00+09:00',
  '2026-08': '2026-06-10T17:00:00+09:00',
  '2026-07': '2026-05-13T15:00:00+09:00',
  '2026-06': '2026-04-08T15:03:00+09:00',
  '2026-05': '2026-03-12T10:19:00+09:00', // exception: 2nd Thursday, morning
  '2026-04': '2026-02-11T15:00:00+09:00',
  '2026-03': '2026-01-14T15:18:00+09:00',
  '2026-02': '2025-12-10T15:03:00+09:00',
  '2026-01': '2025-11-12T15:00:00+09:00',
  '2025-12': '2025-10-08T15:06:00+09:00',
  '2025-11': '2025-09-10T15:25:00+09:00',
  '2025-10': '2025-08-13T15:06:00+09:00',
  '2025-09': '2025-07-09T15:04:00+09:00',
};

/** Fallback rule for unknown months: 2nd Wednesday of (visit month − 2) at 16:00 JST. */
const FALLBACK_RELEASE_HOUR_JST = 16;

function visitMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

/**
 * The exact first-come sale time for a given *visit* month (year + 0-indexed month).
 * Prefers a verified override from @Museum_Nintendo; otherwise falls back to the
 * "2nd Wednesday of two months prior, 16:00 JST" heuristic.
 */
export function getReleaseDateTimeForVisitMonth(year: number, month: number): Date {
  const known = KNOWN_RELEASES[visitMonthKey(year, month)];
  if (known) return new Date(known);

  // Release happens two months before the visit month.
  const releaseMonth = subMonths(startOfMonth(new Date(year, month, 1)), 2);
  const day = calcSecondWednesday(releaseMonth.getFullYear(), releaseMonth.getMonth());
  return getJSTDate(releaseMonth.getFullYear(), releaseMonth.getMonth(), day.getDate(), FALLBACK_RELEASE_HOUR_JST, 0);
}

/**
 * Get the next ticket release time based on current time.
 */
export function getNextTicketReleaseTime(): ReleaseInfo {
  const now = new Date();
  const thisMonth = startOfMonth(now);

  // Releases happen 2 months before the visit month, so the upcoming releases are
  // for visit months M+2, M+3, M+4. Pick the earliest one still in the future.
  for (let i = 0; i < 3; i++) {
    const visitMonth = addMonths(thisMonth, 2 + i);
    const releaseDate = getReleaseDateTimeForVisitMonth(visitMonth.getFullYear(), visitMonth.getMonth());
    if (releaseDate > now) {
      return { releaseDate, forMonth: visitMonth };
    }
  }

  // Safety net — the three candidates are all in the past; return the furthest.
  const lastVisitMonth = addMonths(thisMonth, 4);
  return {
    releaseDate: getReleaseDateTimeForVisitMonth(lastVisitMonth.getFullYear(), lastVisitMonth.getMonth()),
    forMonth: lastVisitMonth,
  };
}

/**
 * Calculate the ticket release date for a planned visit month.
 * @param visitDate The planned visit date (only month/year matters)
 */
export function getTicketReleaseDateForVisit(visitDate: Date): Date {
  return getReleaseDateTimeForVisitMonth(visitDate.getFullYear(), visitDate.getMonth());
}
