import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';
import { getTicketReleaseDateForVisit } from '../utils/ticketLogic';
import { getLotteryScheduleForVisit } from '../utils/lotteryLogic';
import { useTimezone } from '../hooks/useTimezone';
import { Calendar, Calendar as CalendarIcon, Download, ExternalLink } from 'lucide-react';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';
import { vibrate } from '../utils/haptics';

export function TicketCalculator() {
  const { t, i18n } = useTranslation();
  const { timezone } = useTimezone();
  const [visitMonth, setVisitMonth] = useState<string>('');
  const [result, setResult] = useState<Date | null>(null);

  const handleCalculate = () => {
    if (!visitMonth) return;
    // visitMonth from input type="month" is "YYYY-MM"
    // Create date as first day of month
    const [year, month] = visitMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);

    const releaseDate = getTicketReleaseDateForVisit(date);
    setResult(releaseDate);
    vibrate([12]); // confirm the computation landed
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'full',
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
      location: 'https://museum-tickets.nintendo.com/en/calendar'
    };
  };

  const calendarEvent = getCalendarEvent();

  // Lottery schedule is a pure derivation of the chosen visit month.
  const lottery = visitMonth
    ? getLotteryScheduleForVisit(Number(visitMonth.split('-')[0]), Number(visitMonth.split('-')[1]) - 1)
    : null;

  const isPast = result && result < new Date();
  const now = new Date();

  const renderTimelineRow = (label: string, date: Date) => {
    const isDone = date <= now;
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-nintendo-grey shrink-0">{label}</span>
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

        <div className="flex gap-2">
          <input
            type="month"
            value={visitMonth}
            onChange={(e) => setVisitMonth(e.target.value)}
            className="pixel-input flex-1"
            min={new Date().toISOString().slice(0, 7)}
          />
          <PixelButton onClick={handleCalculate}>
            {t('home.calculate')}
          </PixelButton>
        </div>

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
                  {renderTimelineRow(t('home.lotteryEntry'), lottery.entryOpen)}
                  {renderTimelineRow(t('home.lotteryResult'), lottery.result)}
                </>
              )}
              {renderTimelineRow(t('home.firstCome'), result)}
            </div>

            {calendarEvent && !isPast && (
              <div className="flex flex-wrap gap-2">
                <a
                  href={getGoogleCalendarUrl(calendarEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => vibrate()}
                >
                  <PixelButton variant="outline" size="sm" className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {t('home.googleCalendar')}
                  </PixelButton>
                </a>

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
                <a
                  href="https://museum-tickets.nintendo.com/en/calendar"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PixelButton size="sm" className="w-full justify-center flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    {t('home.officialCalendar')}
                  </PixelButton>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </PixelCard>
  );
}
