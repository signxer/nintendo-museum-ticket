import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';
import { getTicketReleaseDateForVisit } from '../utils/ticketLogic';
import { useTimezone } from '../hooks/useTimezone';
import { Calendar, Calendar as CalendarIcon, Download } from 'lucide-react';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';

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
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'full',
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
          <div className="mt-4 p-4 bg-nintendo-light border-4 border-nintendo-grey animate-bounce-pixel">
            <p className="text-sm text-nintendo-grey mb-1">{t('home.canBuy', { month: formatMonth(visitMonth) })}</p>
            <p className="text-lg font-pixel text-nintendo-red mb-4">
              {formatDate(result)}
            </p>
            
            {calendarEvent && (
              <div className="flex flex-wrap gap-2">
                <a 
                  href={getGoogleCalendarUrl(calendarEvent)} 
                  target="_blank" 
                  rel="noopener noreferrer"
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
                  onClick={() => downloadIcsFile(calendarEvent)}
                >
                  <Download className="w-4 h-4" />
                  {t('home.downloadIcs')}
                </PixelButton>
              </div>
            )}
          </div>
        )}
      </div>
    </PixelCard>
  );
}
