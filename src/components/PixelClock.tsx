import React from 'react';
import { useTimezone } from '../hooks/useTimezone';
import { useNow } from '../hooks/useNow';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

interface PixelClockProps {
  className?: string;
}

export function PixelClock({ className }: PixelClockProps) {
  const { timezone } = useTimezone();
  const currentTime = useNow();
  const { i18n } = useTranslation();

  const timeString = currentTime.toLocaleTimeString(i18n.language, {
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
