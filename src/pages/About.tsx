import React from 'react';
import { useTranslation } from 'react-i18next';
import { PixelCard } from '../components/PixelCard';
import { PixelButton } from '../components/PixelButton';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container-pixel py-8 space-y-8">
      <div className="flex items-center gap-4">
        <PixelButton variant="secondary" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
          Back
        </PixelButton>
        <h1 className="text-2xl text-nintendo-red">{t('about.title')}</h1>
      </div>

      <PixelCard title={t('about.rules')}>
        <p className="leading-relaxed">
          {t('about.rulesContent')}
        </p>
      </PixelCard>

      <PixelCard title={t('about.guide')}>
        <p className="leading-relaxed">
          {t('about.guideContent')}
        </p>
      </PixelCard>
      
      <PixelCard title={t('about.disclaimerTitle')}>
        <p className="leading-relaxed text-nintendo-grey">
          {t('about.disclaimerContent')}
        </p>
      </PixelCard>
    </div>
  );
}
