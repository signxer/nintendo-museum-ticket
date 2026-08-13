import { useEffect, useState } from 'react';

/**
 * A ticking "current time" hook, isolated from the timezone value.
 *
 * Only components that actually need to render a live clock should use this —
 * everything else should subscribe to the static timezone store instead, so
 * a per-second tick doesn't re-render the whole page.
 */
export function useNow(intervalMs: number = 1000): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
