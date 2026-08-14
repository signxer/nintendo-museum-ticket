import { create } from 'zustand';
import { getUserTimezone } from '../utils/timezoneUtils';

interface TimezoneState {
  timezone: string;
  /** True when the user hasn't overridden the device timezone. */
  useAutoTimezone: boolean;
  /** Pass 'auto' to (re-)enable device detection; otherwise sets a zone. */
  setTimezone: (tz: string) => void;
}

export const useTimezoneStore = create<TimezoneState>((set) => ({
  timezone: getUserTimezone(),
  useAutoTimezone: true,
  setTimezone: (tz) => {
    if (tz === 'auto') {
      set({ timezone: getUserTimezone(), useAutoTimezone: true });
    } else {
      set({ timezone: tz, useAutoTimezone: false });
    }
  },
}));

/**
 * Static timezone accessor — the value only changes when the user picks a
 * timezone, so subscribing here never re-renders on a clock tick.
 * For a live clock, use `useNow()` instead (see PixelClock).
 */
export function useTimezone() {
  const { timezone, useAutoTimezone, setTimezone } = useTimezoneStore();
  return {
    timezone,
    useAutoTimezone,
    setTimezone,
  };
}
