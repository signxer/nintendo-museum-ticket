import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { getAllTimezones, PREFERRED_ZONES } from '../utils/timezoneUtils';

interface TimezoneDisplayProps {
  timezone: string;
  /** True when the current value is the device-detected zone (auto mode). */
  useAutoTimezone: boolean;
  onTimezoneChange: (tz: string) => void;
  className?: string;
}

export function TimezoneDisplay({ timezone, useAutoTimezone, onTimezoneChange, className }: TimezoneDisplayProps) {
  const { t, i18n } = useTranslation();

  // Memoize the timezone list, re-localized when the UI language changes.
  const { common, rest } = useMemo(() => {
    const all = getAllTimezones(i18n.language);
    return {
      common: all.filter((o) => PREFERRED_ZONES.has(o.value)),
      rest: all.filter((o) => !PREFERRED_ZONES.has(o.value)),
    };
  }, [i18n.language]);

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <Globe className="w-4 h-4 text-nintendo-grey shrink-0" />
      <div className="relative">
        <select
          value={useAutoTimezone ? 'auto' : timezone}
          onChange={(e) => onTimezoneChange(e.target.value)}
          aria-label={t('common.timezone')}
          className="appearance-none bg-transparent font-pixel text-xs sm:text-sm text-nintendo-dark focus:outline-none cursor-pointer border-b border-dashed border-nintendo-grey hover:border-nintendo-red transition-colors pr-6 max-w-[200px] truncate pixel-focus"
        >
          <option value="auto">{t('common.timezoneAuto')}</option>
          <optgroup label={t('common.timezoneCommon')}>
            {common.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
          <optgroup label={t('common.timezoneAll')}>
            {rest.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        </select>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-nintendo-grey">
          ▼
        </div>
      </div>
    </div>
  );
}
