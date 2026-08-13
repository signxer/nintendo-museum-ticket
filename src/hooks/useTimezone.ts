import { create } from 'zustand';
import { getUserTimezone } from '../utils/timezoneUtils';

interface TimezoneState {
  timezone: string;
  setTimezone: (tz: string) => void;
}

export const useTimezoneStore = create<TimezoneState>((set) => ({
  timezone: getUserTimezone(),
  setTimezone: (tz) => set({ timezone: tz }),
}));

/**
 * Static timezone accessor — the value only changes when the user picks a
 * timezone, so subscribing here never re-renders on a clock tick.
 * For a live clock, use `useNow()` instead (see PixelClock).
 */
export function useTimezone() {
  const { timezone, setTimezone } = useTimezoneStore();
  return {
    timezone,
    setTimezone
  };
}
