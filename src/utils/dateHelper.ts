import { addDays, addWeeks } from 'date-fns';

/**
 * Get the date of the second Wednesday of a given year and month
 * @param year The year
 * @param month The month (0-11)
 * @returns The Date object for the second Wednesday
 */
export function calcSecondWednesday(year: number, month: number): Date {
  const firstDay = new Date(year, month, 1);
  const dayOfWeek = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
  
  // Calculate days to add to reach the first Wednesday
  // Wednesday is 3
  // If dayOfWeek <= 3: add 3 - dayOfWeek
  // If dayOfWeek > 3: add 7 - (dayOfWeek - 3) = 10 - dayOfWeek
  const daysToFirstWednesday = (3 - dayOfWeek + 7) % 7;
  
  const firstWednesday = addDays(firstDay, daysToFirstWednesday);
  const secondWednesday = addWeeks(firstWednesday, 1);
  
  return secondWednesday;
}
