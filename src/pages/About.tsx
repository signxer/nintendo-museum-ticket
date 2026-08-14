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
          {t('common.back')}
        </PixelButton>
        <h1 className="text-2xl text-nintendo-red">{t('about.title')}</h1>
      </div>

      <PixelCard title={t('about.rules')}>
        <p className="leading-relaxed mb-3">{t('about.rulesIntro')}</p>
        <ul className="list-disc pl-5 space-y-3 text-sm leading-relaxed">
          <li>{t('about.rulesLottery')}</li>
          <li>{t('about.rulesFirstCome')}</li>
        </ul>
        <p className="leading-relaxed mt-3 text-nintendo-grey text-sm">{t('about.rulesNote')}</p>
      </PixelCard>

      <PixelCard title={t('about.guide')}>
        <p className="leading-relaxed whitespace-pre-line">
          {t('about.guideContent')}
        </p>
      </PixelCard>
      
      <PixelCard title={t('about.disclaimerTitle')}>
        {/* The full disclaimer, matching the first-visit modal (same keys). */}
        <ul className="list-disc pl-5 space-y-3 text-sm leading-relaxed text-nintendo-red">
          <li>{t('disclaimer.intro')}</li>
          <li>{t('disclaimer.rulesChange')}</li>
          <li>{t('disclaimer.timeNote')}</li>
          <li>{t('disclaimer.responsibility')}</li>
          <li>{t('disclaimer.scam')}</li>
          <li>{t('disclaimer.trademark')}</li>
          <li>{t('disclaimer.privacy')}</li>
          <li>{t('disclaimer.externalLinks')}</li>
          <li>{t('disclaimer.asIs')}</li>
        </ul>
      </PixelCard>
    </div>
  );
}
