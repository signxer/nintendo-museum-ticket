import React from 'react';
import { NextReleaseCard } from '../components/NextReleaseCard';
import { TicketCalculator } from '../components/TicketCalculator';
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

      <div className="flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-lg">
          <NextReleaseCard />
        </div>
        
        <div className="w-full max-w-lg">
          <TicketCalculator />
        </div>
      </div>
    </div>
  );
}
