import { addMonths, startOfMonth, subMonths } from 'date-fns';
import { calcSecondWednesday } from './dateHelper';
import { getJSTDate } from './timezoneUtils';

export interface ReleaseInfo {
  releaseDate: Date; // The exact Date object (in local time) when tickets are released
  forMonth: Date;    // The month for which tickets are being sold (start of month)
}

/**
 * Get the next ticket release time based on current time.
 */
export function getNextTicketReleaseTime(): ReleaseInfo {
  const now = new Date();
  
  // Check current month's release
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // 2nd Wednesday of current month at 14:00 JST (Japan Standard Time)
  const currentMonthReleaseDay = calcSecondWednesday(currentYear, currentMonth);
  const currentMonthReleaseTime = getJSTDate(
    currentYear, 
    currentMonth, 
    currentMonthReleaseDay.getDate(), 
    14, // 14:00 JST
    0
  );
  
  // If current time is before this month's release, then this is the next one
  if (now < currentMonthReleaseTime) {
    return {
      releaseDate: currentMonthReleaseTime,
      forMonth: startOfMonth(addMonths(now, 2)) // Actually, it's based on release month. Release Month M -> Tickets for M+2
    };
  }
  
  // Otherwise, it's next month's release
  const nextMonthDate = addMonths(now, 1);
  const nextYear = nextMonthDate.getFullYear();
  const nextMonth = nextMonthDate.getMonth();
  
  const nextMonthReleaseDay = calcSecondWednesday(nextYear, nextMonth);
  const nextMonthReleaseTime = getJSTDate(
    nextYear,
    nextMonth,
    nextMonthReleaseDay.getDate(),
    14, // 14:00 JST
    0
  );
  
  return {
    releaseDate: nextMonthReleaseTime,
    forMonth: startOfMonth(addMonths(nextMonthDate, 2)) // Release Month (Next) + 2
  };
}

/**
 * Calculate the ticket release date for a planned visit month.
 * @param visitDate The planned visit date (only month/year matters)
 */
export function getTicketReleaseDateForVisit(visitDate: Date): Date {
  // To buy tickets for Month V, we need to buy in Month V-2.
  const releaseMonthDate = subMonths(visitDate, 2);
  const year = releaseMonthDate.getFullYear();
  const month = releaseMonthDate.getMonth();
  
  const releaseDay = calcSecondWednesday(year, month);
  
  return getJSTDate(
    year,
    month,
    releaseDay.getDate(),
    14, // 14:00 JST
    0
  );
}
