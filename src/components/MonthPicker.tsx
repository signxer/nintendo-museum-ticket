import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { PixelButton } from './PixelButton';

interface MonthPickerProps {
  /** 'YYYY-MM' or '' */
  value: string;
  onChange: (value: string) => void;
  /** Earliest selectable month, 'YYYY-MM'. */
  min: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Visit-month picker rendered as a theme-styled trigger + custom popup on
 * EVERY device. Deliberately no native <input type="month"> anywhere: on iOS
 * Safari the fallback text field has a fixed intrinsic width that overflows
 * the layout and covers the neighbouring button — a plain <button> trigger
 * shrinks correctly in the grid, so the overlap cannot happen.
 */
export function MonthPicker({ value, onChange, min }: MonthPickerProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    const current = value ? Number(value.slice(0, 4)) : new Date().getFullYear();
    return Math.max(current, Number(min.slice(0, 4)) || current);
  });

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const monthName = (month: number) =>
    new Intl.DateTimeFormat(i18n.language, { month: 'short' }).format(new Date(2026, month, 1));

  const yearLabel = new Intl.DateTimeFormat(i18n.language, { year: 'numeric' }).format(
    new Date(viewYear, 0, 1)
  );

  const isDisabled = (month: number) => `${viewYear}-${pad(month + 1)}` < min;

  return (
    <div className="relative min-w-0">
      {/* Theme-styled trigger, sized like the pixel input. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="pixel-input w-full flex items-center justify-between cursor-pointer text-left"
      >
        <span className={`truncate ${value ? 'text-nintendo-dark' : 'text-nintendo-grey'}`}>
          {value || t('home.visitDatePlaceholder')}
        </span>
        <CalendarIcon className="w-4 h-4 text-nintendo-red shrink-0" />
      </button>

      {open && (
        <>
          {/* Backdrop: click anywhere outside closes the picker. */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-label={t('home.visitDate')}
            className="absolute left-0 right-0 z-20 bottom-full mb-2 bg-white border-4 border-nintendo-dark shadow-pixel p-4"
          >
            {/* Year navigation */}
            <div className="flex items-center justify-between mb-3">
              <PixelButton
                variant="outline"
                size="sm"
                onClick={() => setViewYear((y) => y - 1)}
                aria-label="◀"
                className="flex items-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </PixelButton>
              <span className="font-pixel text-nintendo-dark text-sm">{yearLabel}</span>
              <PixelButton
                variant="outline"
                size="sm"
                onClick={() => setViewYear((y) => y + 1)}
                aria-label="▶"
                className="flex items-center"
              >
                <ChevronRight className="w-4 h-4" />
              </PixelButton>
            </div>

            {/* Month grid — py-2 keeps the tap targets comfortable on touch. */}
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }, (_, m) => {
                const selected = value === `${viewYear}-${pad(m + 1)}`;
                const disabled = isDisabled(m);
                return (
                  <button
                    key={m}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onChange(`${viewYear}-${pad(m + 1)}`);
                      setOpen(false);
                    }}
                    className={`px-1 py-2 font-pixel text-xs border-2 border-nintendo-dark transition-colors ${
                      selected
                        ? 'bg-nintendo-red text-white'
                        : disabled
                          ? 'opacity-30 cursor-not-allowed bg-white text-nintendo-dark'
                          : 'bg-white text-nintendo-dark hover:bg-nintendo-light'
                    }`}
                  >
                    {monthName(m)}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
