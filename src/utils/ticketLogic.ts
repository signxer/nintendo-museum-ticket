import { addMonths, startOfMonth, subMonths } from 'date-fns';
import { calcSecondWednesday } from './dateHelper';
import { getJSTDate, getJSTMonth } from './timezoneUtils';

export interface ReleaseInfo {
  releaseDate: Date; // The exact Date object (in local time) when tickets are released
  forMonth: Date;    // The month for which tickets are being sold (start of month)
}

/**
 * First-come (先着順) sales always start ON THE HOUR (JST). The announced
 * times on the official X (Twitter) account are the announcement times, not
 * the sale start — so the model below uses the real on-the-hour times:
 *
 *  - Visit months before June 2026: sales opened at 14:00 JST.
 *  - Visit months from June 2026 onward: sales open at 16:00 JST
 *    (the schedule changed once, at June 2026).
 *
 * The sale day is the 2nd Wednesday of the month two months before the visit.
 */
function getFirstComeHourJST(visitYear: number, visitMonth: number): number {
  const fromJune2026 = visitYear > 2026 || (visitYear === 2026 && visitMonth >= 5);
  return fromJune2026 ? 16 : 14;
}

/**
 * The exact first-come sale time for a given *visit* month (year + 0-indexed month):
 * 2nd Wednesday of two months prior, on the hour (14:00 JST before June 2026
 * visits, 16:00 JST from June 2026 visits).
 */
export function getReleaseDateTimeForVisitMonth(year: number, month: number): Date {
  // Release happens two months before the visit month.
  const releaseMonth = subMonths(startOfMonth(new Date(year, month, 1)), 2);
  const day = calcSecondWednesday(releaseMonth.getFullYear(), releaseMonth.getMonth());
  return getJSTDate(
    releaseMonth.getFullYear(),
    releaseMonth.getMonth(),
    day.getDate(),
    getFirstComeHourJST(year, month),
    0
  );
}

/**
 * Get the next ticket release time based on current time.
 *
 * "Current month" is derived in JST (the museum's timezone), so the result is
 * correct even for users whose local date lags JST near a month boundary.
 */
export function getNextTicketReleaseTime(): ReleaseInfo {
  const now = new Date();
  const thisMonth = getJSTMonth(now);

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

/**
 * The visit months whose first-come (先着順) sale is currently open.
 * A month is on sale once its verified (or heuristic) release time has passed:
 * the current month and next are always open, and the month after that opens
 * when its release date arrives (roughly the 8th–14th of the current month).
 *
 * The "current month" is JST-based — see getJSTMonth().
 */
export function getFirstComeOnSaleMonths(now: Date): Date[] {
  const base = getJSTMonth(now);
  const onSale: Date[] = [base, addMonths(base, 1)];

  const next = addMonths(base, 2);
  const release = getReleaseDateTimeForVisitMonth(next.getFullYear(), next.getMonth());
  if (release <= now) onSale.push(next);

  return onSale;
}
