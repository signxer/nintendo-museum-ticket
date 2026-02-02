import { create } from 'zustand';
import { useState, useEffect } from 'react';
import { getUserTimezone } from '../utils/timezoneUtils';

interface TimezoneState {
  timezone: string;
  setTimezone: (tz: string) => void;
}

export const useTimezoneStore = create<TimezoneState>((set) => ({
  timezone: getUserTimezone(),
  setTimezone: (tz) => set({ timezone: tz }),
}));

export function useTimezone() {
  const { timezone, setTimezone } = useTimezoneStore();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    timezone,
    setTimezone,
    currentTime
  };
}
