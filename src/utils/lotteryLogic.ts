import { addMonths, startOfMonth } from 'date-fns';
import { getJSTDate } from './timezoneUtils';

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
