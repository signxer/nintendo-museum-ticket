import React from 'react';
import { NextReleaseCard } from '../components/NextReleaseCard';
import { CurrentStatusCard } from '../components/CurrentStatusCard';
import { HomeTabs } from '../components/HomeTabs';
import { PixelButton } from '../components/PixelButton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container-pixel py-8 space-y-8">
      <div className="flex justify-end">
        <PixelButton variant="secondary" size="sm" onClick={() => navigate('/about')}>
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
