import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { getNextTicketReleaseTime, ReleaseInfo } from '../utils/ticketLogic';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';
import { useTimezone } from '../hooks/useTimezone';
import { useTheme } from '../hooks/useTheme';
import confetti from 'canvas-confetti';
import { Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import { GoogleGIcon } from './GoogleGIcon';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';
import { getOfficialCalendarUrl } from '../utils/officialLinks';
import { vibrate } from '../utils/haptics';

/** Localized countdown string for a release date ("还有 26天 5时 ..."), or ''
 *  once the release has passed. */
function buildTimeLeft(releaseDate: Date, t: TFunction): string {
  const diff = releaseDate.getTime() - Date.now();
  if (diff <= 0) return '';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}${t('home.days')}`);
  parts.push(`${hours}${t('home.hours')}`);
  parts.push(`${minutes}${t('home.minutes')}`);
  parts.push(`${seconds}${t('home.seconds')}`);

  return t('home.timeLeft', { time: parts.join(' ') });
}

export function NextReleaseCard() {
  const { t, i18n } = useTranslation();
  const { timezone } = useTimezone();
  const { isOfficial } = useTheme();
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo>(() => getNextTicketReleaseTime());
  // Initialize the countdown synchronously so the first paint already shows
  // it — no empty moment, no height jump one second later.
  const [timeLeft, setTimeLeft] = useState<string>(() => buildTimeLeft(releaseInfo.releaseDate, t));

  // Was the countdown still positive on the previous tick? Tracks the exact
  // instant the countdown crosses zero so we can celebrate once and advance
  // to the next release.
  const wasPositiveRef = useRef(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = releaseInfo.releaseDate.getTime() - now.getTime();

      if (diff <= 0) {
        if (wasPositiveRef.current) {
          // Countdown just hit zero — the real "moment", reward it with
          // confetti, then roll over to the next release.
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              // The official theme has no red — celebrate in its palette.
              colors: isOfficial
                ? ['#76738A', '#FFFFFF', '#3A9CE2']
                : ['#E60012', '#FFFFFF', '#2D2D2D'],
            });
          }
          vibrate([30, 60, 30]);
          setReleaseInfo(getNextTicketReleaseTime());
          setTimeLeft('');
        }
        wasPositiveRef.current = false;
        return;
      }

      wasPositiveRef.current = true;

      setTimeLeft(buildTimeLeft(releaseInfo.releaseDate, t));
    }, 1000);

    return () => clearInterval(timer);
  }, [releaseInfo.releaseDate, t, isOfficial]);

  const formatDate = (date: Date) => {
    // dateStyle 'long' = no weekday, so the big release date stays on one line.
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: timezone
    }).format(date);
  };

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      timeZone: timezone
    }).format(date);
  };

  // ---- Share (moved to the home toolbar — see pages/Home.tsx) ----

  const officialUrl = getOfficialCalendarUrl(i18n.language);

  const calendarEvent = {
    title: t('home.calendarEventTitle', { month: formatMonth(releaseInfo.forMonth) }),
    description: t('home.calendarEventDesc', { month: formatMonth(releaseInfo.forMonth) }),
    startTime: releaseInfo.releaseDate,
    endTime: new Date(releaseInfo.releaseDate.getTime() + 60 * 60 * 1000), // 1 hour duration
    location: officialUrl
  };

  return (
    <PixelCard title={t('home.nextRelease')} className="text-center">
      <div className="text-xl md:text-2xl mb-2 font-pixel leading-snug whitespace-nowrap">
        {formatDate(releaseInfo.releaseDate)}
      </div>

      <div className="text-nintendo-grey text-sm mb-6 font-pixel" aria-live="polite">
        {/* A non-breaking space keeps the line height stable even before the
            first tick or right at the rollover moment. */}
        {timeLeft ? `(${timeLeft})` : '\u00A0'}
      </div>

      <a
        href={officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mb-6 group pixel-focus"
      >
        <div className="bg-nintendo-light p-4 border-2 border-nintendo-grey rounded-sm group-hover:border-nintendo-red group-hover:bg-white transition-colors">
          <p className="text-nintendo-dark font-medium flex items-center gap-2 justify-center">
            {t('home.forMonth', { month: formatMonth(releaseInfo.forMonth) })}
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </p>
        </div>
      </a>

      {/* Two action buttons side by side — with the share button moved to the
          toolbar they have plenty of room for full text labels. Same height
          (h-10) as the "去抽选/购买" button. */}
      <div className="grid grid-cols-2 gap-2 mt-2" role="group" aria-label={t('home.tools')}>
        <PixelButton
          as="a"
          variant="primary"
          href={getGoogleCalendarUrl(calendarEvent)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('home.googleCalendar')}
          className="nm-action-btn h-10 flex items-center justify-center gap-1"
          onClick={() => vibrate()}
        >
          <GoogleGIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{t('home.googleCalendar')}</span>
        </PixelButton>

        <PixelButton
          variant="primary"
          aria-label={t('home.downloadIcs')}
          className="nm-action-btn h-10 flex items-center justify-center gap-1"
          onClick={() => {
            vibrate();
            downloadIcsFile(calendarEvent);
          }}
        >
          <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{t('home.downloadIcs')}</span>
        </PixelButton>

      </div>
    </PixelCard>
  );
}
