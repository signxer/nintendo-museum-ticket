import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PixelButton } from './PixelButton';

const DISCLAIMER_KEY = 'nmt-disclaimer-accepted';

/**
 * First-visit disclaimer: shown until the visitor explicitly acknowledges the
 * fan-made / not-affiliated / times-are-estimates / no-responsibility terms.
 * The acknowledgment is persisted, so it only appears once.
 */
export function DisclaimerModal() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(DISCLAIMER_KEY) !== '1';
    } catch {
      return true;
    }
  });

  // Block page scrolling behind the modal while it is open.
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  if (!visible) return null;

  const acknowledge = () => {
    try {
      localStorage.setItem(DISCLAIMER_KEY, '1');
    } catch { /* ignore */ }
    setVisible(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('disclaimer.title')}
    >
      <div className="w-full max-w-md bg-white border-4 border-nintendo-dark shadow-pixel p-6">
        <h2 className="font-pixel text-lg md:text-xl text-nintendo-red mb-4">{t('disclaimer.title')}</h2>
        <ul className="list-disc pl-5 space-y-3 text-sm text-nintendo-dark leading-relaxed">
          <li>{t('disclaimer.intro')}</li>
          <li>{t('disclaimer.timeNote')}</li>
          <li>{t('disclaimer.responsibility')}</li>
          <li>{t('disclaimer.trademark')}</li>
        </ul>
        <div className="mt-6 flex justify-center">
          <PixelButton onClick={acknowledge} className="h-10 flex items-center">
            {t('disclaimer.acknowledge')}
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
