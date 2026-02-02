import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getNextTicketReleaseTime } from '../utils/ticketLogic';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';
import { useTimezone } from '../hooks/useTimezone';
import confetti from 'canvas-confetti';
import { Calendar as CalendarIcon, Download, ExternalLink } from 'lucide-react';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';

export function NextReleaseCard() {
  const { t, i18n } = useTranslation();
  const { timezone } = useTimezone();
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const releaseInfo = getNextTicketReleaseTime();
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = releaseInfo.releaseDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        // Trigger confetti if just reached 0?
      } else {
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
      }
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

  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E60012', '#FFFFFF', '#2D2D2D'] // Nintendo colors
    });
  };

  const calendarEvent = {
    title: t('home.calendarEventTitle', { month: formatMonth(releaseInfo.forMonth) }),
    description: t('home.calendarEventDesc', { month: formatMonth(releaseInfo.forMonth) }),
    startTime: releaseInfo.releaseDate,
    endTime: new Date(releaseInfo.releaseDate.getTime() + 60 * 60 * 1000), // 1 hour duration
    location: 'https://museum-tickets.nintendo.com/en/calendar'
  };

  return (
    <PixelCard className="text-center transform hover:-translate-y-1 transition-transform cursor-pointer" onClick={handleConfetti}>
      <h2 className="text-lg mb-4 text-nintendo-red">{t('home.nextRelease')}</h2>
      
      <div className="text-xl md:text-3xl font-bold mb-2 font-pixel leading-relaxed break-words">
        {formatDate(releaseInfo.releaseDate)}
      </div>
      
      <div className="text-nintendo-grey text-sm mb-6 font-pixel">
        {timeLeft && `(${timeLeft})`}
      </div>
      
      <a 
        href="https://museum-tickets.nintendo.com/en/calendar" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block mb-6 group"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-nintendo-light p-4 border-2 border-nintendo-grey rounded-sm group-hover:border-nintendo-red group-hover:bg-white transition-colors">
          <p className="text-nintendo-dark font-medium flex items-center gap-2 justify-center">
            {t('home.forMonth', { month: formatMonth(releaseInfo.forMonth) })}
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </p>
        </div>
      </a>

      <div className="flex flex-wrap justify-center gap-2 mt-2">
        <a 
          href={getGoogleCalendarUrl(calendarEvent)} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
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
          onClick={(e) => {
            e.stopPropagation();
            downloadIcsFile(calendarEvent);
          }}
        >
          <Download className="w-4 h-4" />
          {t('home.downloadIcs')}
        </PixelButton>
      </div>
    </PixelCard>
  );
}
