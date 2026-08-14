import React, { useState } from 'react';
import { NextReleaseCard } from '../components/NextReleaseCard';
import { CurrentStatusCard } from '../components/CurrentStatusCard';
import { HomeTabs } from '../components/HomeTabs';
import { PixelClock } from '../components/PixelClock';
import { PixelButton } from '../components/PixelButton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTimezone } from '../hooks/useTimezone';
import { getNextTicketReleaseTime } from '../utils/ticketLogic';
import { getOfficialCalendarUrl } from '../utils/officialLinks';
import { shareText } from '../utils/share';
import { Info, Clock, Share2 } from 'lucide-react';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { timezone } = useTimezone();
  const navigate = useNavigate();
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'unsupported'>('idle');

  // Shares the next ticket release (month + local time) via the Web Share API
  // or a clipboard fallback.
  const handleShare = async () => {
    const releaseInfo = getNextTicketReleaseTime();
    const formatDate = (date: Date) =>
      new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long', timeStyle: 'short', timeZone: timezone }).format(date);
    const formatMonth = (date: Date) =>
      new Intl.DateTimeFormat(i18n.language, { year: 'numeric', month: 'long', timeZone: timezone }).format(date);

    const text = t('home.shareText', {
      month: formatMonth(releaseInfo.forMonth),
      date: formatDate(releaseInfo.releaseDate),
    });
    const result = await shareText(text, getOfficialCalendarUrl(i18n.language));
    if (result === 'copied') {
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 2000);
    } else if (result === 'unsupported') {
      setShareState('unsupported');
    }
  };

  return (
    <div className="container-pixel py-8 space-y-8">
      {/* Toolbar row: live clock badge on the left, share + About on the right.
          All three share h-9 so they sit at the same height in every theme. */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 h-9 px-3 bg-white border-2 border-nintendo-dark shadow-pixel-sm">
          <Clock className="w-4 h-4 text-nintendo-red shrink-0" />
          <PixelClock className="text-sm text-nintendo-dark" />
        </div>
        <div className="flex items-center gap-2">
          <PixelButton variant="outline" size="sm" className="h-9 flex items-center bg-white border-2 border-nintendo-dark shadow-pixel-sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2 inline-block" />
            {shareState === 'copied' ? t('home.shareCopied') : t('home.share')}
          </PixelButton>
          <PixelButton variant="secondary" size="sm" className="h-9 flex items-center" onClick={() => navigate('/about')}>
            <Info className="w-4 h-4 mr-2 inline-block" />
            {t('about.title')}
          </PixelButton>
        </div>
      </div>

      {/* Status area: side-by-side on desktop, stacked on mobile. Both cards
          stretch to the same row height (no items-start). */}
      <div className="grid gap-8 lg:grid-cols-2">
        <CurrentStatusCard />
        <NextReleaseCard />
      </div>

      {/* Tools (calculator / release schedule) live in tabs to save vertical
          space on desktop. */}
      <HomeTabs />
    </div>
  );
}
