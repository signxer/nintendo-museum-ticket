import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getNextTicketReleaseTime, ReleaseInfo } from '../utils/ticketLogic';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';
import { useTimezone } from '../hooks/useTimezone';
import confetti from 'canvas-confetti';
import { Calendar as CalendarIcon, Download, ExternalLink, Share2, Bell, BellOff } from 'lucide-react';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';
import { getOfficialCalendarUrl } from '../utils/officialLinks';
import { shareText } from '../utils/share';
import { vibrate } from '../utils/haptics';

/** How long before the release the reminder fires. */
const REMIND_LEAD_MS = 10 * 60 * 1000;
const REMINDER_KEY = 'nmt-reminder';

interface StoredReminder {
  releaseTime: number;
}

function readStoredReminder(): StoredReminder | null {
  try {
    const raw = localStorage.getItem(REMINDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReminder;
    return typeof parsed?.releaseTime === 'number' ? parsed : null;
  } catch {
    return null;
  }
}

export function NextReleaseCard() {
  const { t, i18n } = useTranslation();
  const { timezone } = useTimezone();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo>(() => getNextTicketReleaseTime());
  const [remindState, setRemindState] = useState<'idle' | 'set' | 'unsupported'>(() =>
    readStoredReminder() ? 'set' : 'idle'
  );
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'unsupported'>('idle');

  // Was the countdown still positive on the previous tick? Tracks the exact
  // instant the countdown crosses zero so we can celebrate once and advance
  // to the next release.
  const wasPositiveRef = useRef(true);
  const remindTimerRef = useRef<number | null>(null);
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
              colors: ['#E60012', '#FFFFFF', '#2D2D2D'], // Nintendo colors
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
  }, [releaseInfo.releaseDate, t]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'full',
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

  // ---- Reminder ----------------------------------------------------------

  /** Arms the in-page timer; returns false when it's already too late to arm. */
  const scheduleReminder = useCallback((release: Date): boolean => {
    if (remindTimerRef.current !== null) {
      window.clearTimeout(remindTimerRef.current);
      remindTimerRef.current = null;
    }
    const delay = release.getTime() - REMIND_LEAD_MS - Date.now();
    if (delay <= 0) return false; // too late to arm
    remindTimerRef.current = window.setTimeout(() => {
      try {
        new Notification(t('home.remindNotifTitle'), {
          body: t('home.remindNotifBody'),
          icon: '/favicon.svg',
        });
      } catch {
        // Notification constructor can throw in odd environments — never break.
      }
      try {
        localStorage.removeItem(REMINDER_KEY);
      } catch { /* ignore */ }
      setRemindState('idle');
      remindTimerRef.current = null;
    }, delay);
    return true;
  }, [t]);

  // Re-arm a persisted reminder after reload; drop ones that no longer match
  // the current release (e.g. the countdown already rolled over, or the
  // release passed while the page was closed).
  useEffect(() => {
    const stored = readStoredReminder();
    if (stored && stored.releaseTime === releaseInfo.releaseDate.getTime()) {
      if (scheduleReminder(releaseInfo.releaseDate)) {
        setRemindState('set');
      } else {
        try {
          localStorage.removeItem(REMINDER_KEY);
        } catch { /* ignore */ }
        setRemindState('idle');
      }
    } else if (stored) {
      try {
        localStorage.removeItem(REMINDER_KEY);
      } catch { /* ignore */ }
    }
    return () => {
      if (remindTimerRef.current !== null) window.clearTimeout(remindTimerRef.current);
      if (shareTimerRef.current !== null) window.clearTimeout(shareTimerRef.current);
    };
  }, [releaseInfo.releaseDate, scheduleReminder]);

  const armReminder = () => {
    if (!scheduleReminder(releaseInfo.releaseDate)) return; // too late — don't persist a dead reminder
    try {
      localStorage.setItem(REMINDER_KEY, JSON.stringify({ releaseTime: releaseInfo.releaseDate.getTime() }));
    } catch { /* ignore */ }
    setRemindState('set');
  };

  const handleRemind = () => {
    if (remindState === 'set') {
      try {
        localStorage.removeItem(REMINDER_KEY);
      } catch { /* ignore */ }
      if (remindTimerRef.current !== null) {
        window.clearTimeout(remindTimerRef.current);
        remindTimerRef.current = null;
      }
      setRemindState('idle');
      vibrate();
      return;
    }
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setRemindState('unsupported');
      return;
    }
    if (Notification.permission === 'granted') {
      armReminder();
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') armReminder();
        else setRemindState('unsupported');
      });
    } else {
      setRemindState('unsupported');
    }
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
      <div className="text-xl md:text-3xl font-bold mb-2 font-pixel leading-relaxed break-words">
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

      <div className="flex flex-wrap justify-center gap-2 mt-2">
        <PixelButton
          as="a"
          variant="outline"
          size="sm"
          href={getGoogleCalendarUrl(calendarEvent)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
          onClick={() => vibrate()}
        >
          <CalendarIcon className="w-4 h-4" />
          {t('home.googleCalendar')}
        </PixelButton>

        <PixelButton
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => {
            vibrate();
            downloadIcsFile(calendarEvent);
          }}
        >
          <Download className="w-4 h-4" />
          {t('home.downloadIcs')}
        </PixelButton>

        <PixelButton
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
          {shareState === 'copied' ? t('home.shareCopied') : t('home.share')}
        </PixelButton>

        <PixelButton
          variant={remindState === 'set' ? 'secondary' : 'outline'}
          size="sm"
          className="flex items-center gap-2"
          onClick={handleRemind}
          aria-pressed={remindState === 'set'}
        >
          {remindState === 'set' ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          {remindState === 'set'
            ? t('home.remindSet')
            : remindState === 'unsupported'
              ? t('home.remindUnsupported')
              : t('home.remindMe')}
        </PixelButton>
      </div>
    </PixelCard>
  );
}
