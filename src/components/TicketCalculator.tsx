import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';
import { getTicketReleaseDateForVisit } from '../utils/ticketLogic';
import { getLotteryScheduleForVisit } from '../utils/lotteryLogic';
import { useTimezone } from '../hooks/useTimezone';
import { Calendar, Calendar as CalendarIcon, Calculator as CalcIcon, ExternalLink, Share2 } from 'lucide-react';
import { GoogleGIcon } from './GoogleGIcon';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';
import { getOfficialCalendarUrl } from '../utils/officialLinks';
import { vibrate } from '../utils/haptics';
import { getLocalYearMonth } from '../utils/dateHelper';
import { shareText } from '../utils/share';
import { cn } from '../lib/utils';
import { MonthPicker } from './MonthPicker';

/** Matches "YYYY-MM" so shared ?visit= links are validated before use. */
const VISIT_PARAM_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export function TicketCalculator() {
  const { t, i18n } = useTranslation();
  const { timezone } = useTimezone();
  const [visitMonth, setVisitMonth] = useState<string>('');
  const [result, setResult] = useState<Date | null>(null);
  const [error, setError] = useState<string>('');
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'unsupported'>('idle');
  const [searchParams, setSearchParams] = useSearchParams();

  // Pre-fill from a shared link: ?visit=YYYY-MM auto-calculates the release.
  useEffect(() => {
    const visit = searchParams.get('visit') || '';
    if (!VISIT_PARAM_RE.test(visit)) return;
    setVisitMonth(visit);
    const [year, month] = visit.split('-').map(Number);
    setResult(getTicketReleaseDateForVisit(new Date(year, month - 1, 1)));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCalculate = () => {
    if (!visitMonth) {
      setError(t('home.pleaseSelectDate'));
      vibrate([10]);
      return;
    }
    setError('');
    // visitMonth from input type="month" is "YYYY-MM"
    // Create date as first day of month
    const [year, month] = visitMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);

    const releaseDate = getTicketReleaseDateForVisit(date);
    setResult(releaseDate);
    vibrate([12]); // confirm the computation landed

    // Keep the URL shareable without pushing a history entry.
    setSearchParams({ visit: visitMonth }, { replace: true });
  };

  const formatDate = (date: Date) => {
    // dateStyle 'long' = no weekday, consistent with the next-release card.
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: timezone
    }).format(date);
  };

  // Compact variant for the multi-row timeline (full dates are too verbose).
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone
    }).format(date);
  };

  const formatMonth = (monthStr: string) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };

  const getCalendarEvent = () => {
    if (!result || !visitMonth) return null;
    return {
      title: t('home.calendarEventTitle', { month: formatMonth(visitMonth) }),
      description: t('home.calendarEventDesc', { month: formatMonth(visitMonth) }),
      startTime: result,
      endTime: new Date(result.getTime() + 60 * 60 * 1000), // 1 hour duration
      location: getOfficialCalendarUrl(i18n.language)
    };
  };

  const calendarEvent = getCalendarEvent();

  // Lottery schedule is a pure derivation of the chosen visit month.
  const lottery = visitMonth
    ? getLotteryScheduleForVisit(Number(visitMonth.split('-')[0]), Number(visitMonth.split('-')[1]) - 1)
    : null;

  const isPast = result && result < new Date();
  const now = new Date();

  const handleShare = async () => {
    if (!result || !visitMonth) return;
    const text = t('home.shareText', {
      month: formatMonth(visitMonth),
      date: formatDate(result),
    });
    const shareResult = await shareText(text, `${window.location.origin}${window.location.pathname}?visit=${visitMonth}`);
    if (shareResult === 'copied') {
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 2000);
    } else if (shareResult === 'unsupported') {
      setShareState('unsupported');
    }
  };

  const renderTimelineRow = (label: string, date: Date, tone?: 'lottery' | 'sale') => {
    const isDone = date <= now;
    return (
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            'text-xs text-nintendo-grey shrink-0',
            tone === 'lottery' && 'nm-chip-lottery',
            tone === 'sale' && 'nm-chip-sale'
          )}
        >
          {label}
        </span>
        <span className="text-sm font-pixel text-nintendo-dark text-right flex-1">{formatDateTime(date)}</span>
        <span
          className={`text-[10px] px-1.5 py-0.5 shrink-0 ${
            isDone ? 'bg-nintendo-grey text-white' : 'bg-nintendo-red text-white'
          }`}
        >
          {isDone ? t('home.past') : t('home.upcoming')}
        </span>
      </div>
    );
  };

  return (
    <PixelCard title={t('home.calculator')} className="w-full">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-bold flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {t('home.visitDate')}
        </label>

        {/* Grid (not flex) — minmax(0,1fr) lets the input column shrink all
            the way down on mobile browsers, and the auto button column can
            never be covered. */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <MonthPicker
            value={visitMonth}
            onChange={(v) => {
              setVisitMonth(v);
              setError('');
            }}
            min={getLocalYearMonth(new Date())}
          />
          <PixelButton onClick={handleCalculate} className="flex items-center">
            <CalcIcon className="w-4 h-4 mr-1.5 shrink-0" />
            {t('home.calculate')}
          </PixelButton>
        </div>

        {error && (
          <p role="alert" className="text-xs text-nintendo-red font-pixel">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-4 p-4 bg-nintendo-light border-4 border-nintendo-grey animate-pixel-land">
            <p className="text-sm text-nintendo-grey mb-1">{t('home.canBuy', { month: formatMonth(visitMonth) })}</p>
            <p className="text-lg font-pixel text-nintendo-red mb-4">
              {formatDate(result)}
            </p>

            {/* Full purchase path: lottery entry → lottery result → first-come */}
            <div className="border-t-2 border-dashed border-nintendo-grey pt-3 mt-2 mb-3 space-y-2">
              <p className="text-xs font-bold text-nintendo-dark mb-1">{t('home.purchasePath')}</p>
              {lottery && (
                <>
                  {renderTimelineRow(t('home.lotteryEntry'), lottery.entryOpen, 'lottery')}
                  {renderTimelineRow(t('home.lotteryResult'), lottery.result, 'lottery')}
                </>
              )}
              {renderTimelineRow(t('home.firstCome'), result, 'sale')}
            </div>

            {calendarEvent && !isPast && (
              <div className="flex flex-wrap gap-2">
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
                  <GoogleGIcon className="w-4 h-4 shrink-0" />
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
                  <CalendarIcon className="w-4 h-4 shrink-0" />
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
              </div>
            )}

            {isPast && (
              <div className="bg-white p-3 border-2 border-nintendo-grey text-sm">
                <p className="font-bold text-nintendo-red mb-1">
                  {t('home.missedReleaseTitle')}
                </p>
                <p className="mb-3 text-gray-600">
                  {t('home.missedReleaseDesc')}
                </p>
                <PixelButton
                  as="a"
                  size="sm"
                  href={getOfficialCalendarUrl(i18n.language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full justify-center flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('home.officialCalendar')}
                </PixelButton>
              </div>
            )}
          </div>
        )}
      </div>
    </PixelCard>
  );
}
