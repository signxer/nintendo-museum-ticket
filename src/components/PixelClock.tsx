import React from 'react';
import { useTimezone } from '../hooks/useTimezone';
import { useNow } from '../hooks/useNow';
import { cn } from '../lib/utils';

interface PixelClockProps {
  className?: string;
}

export function PixelClock({ className }: PixelClockProps) {
  const { timezone } = useTimezone();
  const currentTime = useNow();

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: timezone
  });

  return (
    <div className={cn("font-pixel text-nintendo-red text-xl tracking-wider", className)}>
      {timeString}
    </div>
  );
}
