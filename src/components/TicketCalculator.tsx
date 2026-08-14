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
  // The visit month of the last calculation — `result` is the RELEASE date,
  // which is not the visit month, so the lottery timeline needs its own copy.
  const [resultVisitMonth, setResultVisitMonth] = useState<string>('');
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
    setResultVisitMonth(visit);
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
    setResultVisitMonth(visitMonth);
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

  // Everything below derives from the CALCULATED result (not the draft
  // input), so editing the month without pressing "Calculate" leaves the
  // result panel — lottery times included — untouched.
  const lottery = resultVisitMonth
    ? getLotteryScheduleForVisit(
        Number(resultVisitMonth.split('-')[0]),
        Number(resultVisitMonth.split('-')[1]) - 1
      )
    : null;

  const now = new Date();
  // The visit month has truly ended (only reachable via an old ?visit= link,
  // since the picker's min is the current month).
  const visitEnded = result ? resultVisitMonth < getLocalYearMonth(now) : false;

  const getCalendarEvent = () => {
    if (!result || !resultVisitMonth) return null;
    return {
      title: t('home.calendarEventTitle', { month: formatMonth(resultVisitMonth) }),
      description: t('home.calendarEventDesc', { month: formatMonth(resultVisitMonth) }),
      startTime: result,
      endTime: new Date(result.getTime() + 60 * 60 * 1000), // 1 hour duration
      location: getOfficialCalendarUrl(i18n.language)
    };
  };

  const calendarEvent = getCalendarEvent();

  const handleShare = async () => {
    if (!result || !resultVisitMonth) return;
    const text = t('home.shareText', {
      month: formatMonth(resultVisitMonth),
      date: formatDate(result),
    });
    const shareResult = await shareText(text, `${window.location.origin}${window.location.pathname}?visit=${resultVisitMonth}`);
    if (shareResult === 'copied') {
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 2000);
    } else if (shareResult === 'unsupported') {
      setShareState('unsupported');
    }
  };

  const renderTimelineRow = (
    label: string,
    date: Date,
    tone: 'lottery' | 'sale',
    status: 'upcoming' | 'ongoing' | 'past'
  ) => {
    const badgeClass =
      status === 'past'
        ? 'bg-nintendo-grey text-white'
        : status === 'ongoing'
          ? 'bg-nintendo-dark text-white'
          : 'bg-nintendo-red text-white';
    const badgeText =
      status === 'past' ? t('home.past') : status === 'ongoing' ? t('home.ongoing') : t('home.upcoming');
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
        <span className={`text-[10px] px-1.5 py-0.5 shrink-0 ${badgeClass}`}>{badgeText}</span>
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
            <p className="text-sm text-nintendo-grey mb-1">{t('home.canBuy', { month: formatMonth(resultVisitMonth) })}</p>
            <p className="text-lg font-pixel text-nintendo-red mb-4">
              {formatDate(result)}
            </p>

            {/* Full purchase path: lottery entry → lottery result → first-come */}
            <div className="border-t-2 border-dashed border-nintendo-grey pt-3 mt-2 mb-3 space-y-2">
              <p className="text-xs font-bold text-nintendo-dark mb-1">{t('home.purchasePath')}</p>
              {lottery && (
                <>
                  {renderTimelineRow(
                    t('home.lotteryEntry'),
                    lottery.entryOpen,
                    'lottery',
                    now < lottery.entryOpen
                      ? 'upcoming'
                      : now < lottery.result
                        ? 'ongoing'
                        : 'past'
                  )}
                  {renderTimelineRow(
                    t('home.lotteryResult'),
                    lottery.result,
                    'lottery',
                    now < lottery.result ? 'upcoming' : 'past'
                  )}
                </>
              )}
              {/* First-come sale stays "in progress" while the visit month is
                  still current — you can keep buying this month's tickets.
                  Only a visit month that has fully ended is "past". */}
              {renderTimelineRow(
                t('home.firstCome'),
                result,
                'sale',
                visitEnded ? 'past' : now < result ? 'upcoming' : 'ongoing'
              )}
            </div>

            {calendarEvent && !visitEnded && (
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

            {visitEnded && (
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
