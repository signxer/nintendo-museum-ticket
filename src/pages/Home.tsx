import React from 'react';
import { NextReleaseCard } from '../components/NextReleaseCard';
import { CurrentStatusCard } from '../components/CurrentStatusCard';
import { HomeTabs } from '../components/HomeTabs';
import { PixelClock } from '../components/PixelClock';
import { PixelButton } from '../components/PixelButton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Info, Clock } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container-pixel py-8 space-y-8">
      {/* Toolbar row: live clock badge on the left, About button on the right.
          Both share h-9 so the two sit at the same height in every theme. */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 h-9 px-3 bg-white border-2 border-nintendo-dark shadow-pixel-sm">
          <Clock className="w-4 h-4 text-nintendo-red shrink-0" />
          <PixelClock className="text-sm text-nintendo-dark" />
        </div>
        <PixelButton variant="secondary" size="sm" className="h-9 flex items-center" onClick={() => navigate('/about')}>
          <Info className="w-4 h-4 mr-2 inline-block" />
          {t('about.title')}
        </PixelButton>
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
