import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getNextTicketReleaseTime, ReleaseInfo } from '../utils/ticketLogic';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';
import { useTimezone } from '../hooks/useTimezone';
import { useTheme } from '../hooks/useTheme';
import confetti from 'canvas-confetti';
import { Calendar as CalendarIcon, Download, ExternalLink, Share2 } from 'lucide-react';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';
import { getOfficialCalendarUrl } from '../utils/officialLinks';
import { shareText } from '../utils/share';
import { vibrate } from '../utils/haptics';

export function NextReleaseCard() {
  const { t, i18n } = useTranslation();
  const { timezone } = useTimezone();
  const { isOfficial } = useTheme();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo>(() => getNextTicketReleaseTime());
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'unsupported'>('idle');

  // Was the countdown still positive on the previous tick? Tracks the exact
  // instant the countdown crosses zero so we can celebrate once and advance
  // to the next release.
  const wasPositiveRef = useRef(true);
  const shareTimerRef = useRef<number | null>(null);

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

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Localized time string
      const parts = [];
      if (days > 0) parts.push(`${days}${t('home.days')}`);
      parts.push(`${hours}${t('home.hours')}`);
      parts.push(`${minutes}${t('home.minutes')}`);
      parts.push(`${seconds}${t('home.seconds')}`);

      const timeString = parts.join(' ');
      setTimeLeft(t('home.timeLeft', { time: timeString }));
    }, 1000);

    return () => clearInterval(timer);
  }, [releaseInfo.releaseDate, t, isOfficial]);

  useEffect(() => {
    return () => {
      if (shareTimerRef.current !== null) window.clearTimeout(shareTimerRef.current);
    };
  }, []);

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

  // ---- Share --------------------------------------------------------------

  const officialUrl = getOfficialCalendarUrl(i18n.language);

  const handleShare = async () => {
    const text = t('home.shareText', {
      month: formatMonth(releaseInfo.forMonth),
      date: formatDate(releaseInfo.releaseDate),
    });
    const result = await shareText(text, officialUrl);
    if (result === 'copied') {
      setShareState('copied');
      shareTimerRef.current = window.setTimeout(() => setShareState('idle'), 2000);
    } else if (result === 'unsupported') {
      setShareState('unsupported');
    }
  };

  const calendarEvent = {
    title: t('home.calendarEventTitle', { month: formatMonth(releaseInfo.forMonth) }),
    description: t('home.calendarEventDesc', { month: formatMonth(releaseInfo.forMonth) }),
    startTime: releaseInfo.releaseDate,
    endTime: new Date(releaseInfo.releaseDate.getTime() + 60 * 60 * 1000), // 1 hour duration
    location: officialUrl
  };

  return (
    <PixelCard title={t('home.nextRelease')} className="text-center">
      <div className="text-xl md:text-2xl font-bold mb-2 font-pixel leading-snug whitespace-nowrap">
        {formatDate(releaseInfo.releaseDate)}
      </div>

      <div className="text-nintendo-grey text-sm mb-6 font-pixel" aria-live="polite">
        {timeLeft ? `(${timeLeft})` : ''}
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

      {/* One-row action buttons, filled with the theme color. Icon-only so
          they stay on a single line in every language. */}
      <div className="grid grid-cols-3 gap-2 mt-2" role="group" aria-label={t('home.tools')}>
        <PixelButton
          as="a"
          variant="primary"
          size="sm"
          href={getGoogleCalendarUrl(calendarEvent)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('home.googleCalendar')}
          title={t('home.googleCalendar')}
          className="flex items-center justify-center"
          onClick={() => vibrate()}
        >
          <CalendarIcon className="w-4 h-4" />
        </PixelButton>

        <PixelButton
          variant="primary"
          size="sm"
          aria-label={t('home.downloadIcs')}
          title={t('home.downloadIcs')}
          className="flex items-center justify-center"
          onClick={() => {
            vibrate();
            downloadIcsFile(calendarEvent);
          }}
        >
          <Download className="w-4 h-4" />
        </PixelButton>

        <PixelButton
          variant="primary"
          size="sm"
          aria-label={t('home.share')}
          title={t('home.share')}
          className="flex items-center justify-center"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
        </PixelButton>
      </div>

      {shareState === 'copied' && (
        <p role="status" className="text-xs text-nintendo-grey mt-2 font-pixel">
          {t('home.shareCopied')}
        </p>
      )}
    </PixelCard>
  );
}
