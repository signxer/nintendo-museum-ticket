import { addMonths, startOfMonth } from 'date-fns';
import { getJSTDate, getJSTMonth } from './timezoneUtils';

export interface LotterySchedule {
  entryOpen: Date; // when drawing (抽選) entries open
  result: Date;    // when drawing results are announced
}

/**
 * Lottery (抽選) schedule for a given *visit* month (year + 0-indexed month).
 *
 * Official pattern from @Museum_Nintendo announcements:
 *  - Entries open on the 1st of month (V − 3) at 10:00 JST.
 *  - Results announced on the 1st of month (V − 2) at 16:00 JST.
 * The first-come (先着順) sale follows later in that same month (V − 2) — see
 * ticketLogic.ts for the exact verified times.
 */
export function getLotteryScheduleForVisit(year: number, month: number): LotterySchedule {
  const visit = startOfMonth(new Date(year, month, 1));

  const entryMonth = addMonths(visit, -3);
  const entryOpen = getJSTDate(entryMonth.getFullYear(), entryMonth.getMonth(), 1, 10, 0);

  const resultMonth = addMonths(visit, -2);
  const result = getJSTDate(resultMonth.getFullYear(), resultMonth.getMonth(), 1, 16, 0);

  return { entryOpen, result };
}

/**
 * The visit month whose lottery (抽選) entry window is currently open, or null
 * when no entry window is open.
 *
 * Per the official pattern, entries for visit month V open on the 1st of V−3
 * at 10:00 JST and close when results are announced on the 1st of V−2 at
 * 16:00 JST. Consecutive windows can briefly overlap (a new window opens at
 * 10:00 on the day results for the previous one land at 16:00), so we scan
 * candidates from the most recently opened window backwards and return the
 * latest one whose window actually contains `now` — never a made-up month.
 *
 * "Current month" is JST-based — see getJSTMonth().
 */
export function getOpenLotteryEntryMonth(now: Date): Date | null {
  const jstMonth = getJSTMonth(now);

  // Visit months M+2 … M+4 can have an open window at any instant; prefer the
  // most recently opened one so overlapping windows resolve to the new entry.
  for (let i = 4; i >= 2; i--) {
    const visit = addMonths(jstMonth, i);
    const entryMonth = addMonths(visit, -3);
    const entryOpen = getJSTDate(entryMonth.getFullYear(), entryMonth.getMonth(), 1, 10, 0);
    const resultMonth = addMonths(visit, -2);
    const result = getJSTDate(resultMonth.getFullYear(), resultMonth.getMonth(), 1, 16, 0);

    if (now >= entryOpen && now < result) return visit;
  }

  return null;
}
