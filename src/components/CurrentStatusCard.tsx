import React from 'react';
import { useTranslation } from 'react-i18next';
import { PixelCard } from './PixelCard';
import { getOpenLotteryEntryMonth } from '../utils/lotteryLogic';
import { getFirstComeOnSaleMonths } from '../utils/ticketLogic';
import { useTimezone } from '../hooks/useTimezone';

/**
 * A prominent "what's happening right now" card: which lottery entry is open
 * and which months are currently on sale via first-come.
 */
export function CurrentStatusCard() {
  const { t, i18n } = useTranslation();
  const { timezone } = useTimezone();

  const now = new Date();
  const openLotteryMonth = getOpenLotteryEntryMonth(now);
  const onSaleMonths = getFirstComeOnSaleMonths(now);

  const formatMonth = (date: Date) =>
    new Intl.DateTimeFormat(i18n.language, { year: 'numeric', month: 'long', timeZone: timezone }).format(date);

  const formatShortMonth = (date: Date) =>
    new Intl.DateTimeFormat(i18n.language, { year: 'numeric', month: 'short', timeZone: timezone }).format(date);

  const onSaleText = onSaleMonths.map(formatShortMonth).join(' · ');

  return (
    <PixelCard className="w-full">
      <h2 className="text-lg md:text-xl mb-5 text-nintendo-red">{t('home.currentStatus')}</h2>

      <div className="space-y-5">
        <div>
          <p className="text-sm text-nintendo-grey mb-1">{t('home.lotteryRegistering')}</p>
          <p className="text-2xl md:text-3xl font-pixel text-nintendo-dark leading-snug break-words">
            {formatMonth(openLotteryMonth)}
          </p>
        </div>

        <div className="border-t-2 border-dashed border-nintendo-grey pt-4">
          <p className="text-sm text-nintendo-grey mb-1">{t('home.firstComeAvailable')}</p>
          <p className="text-2xl md:text-3xl font-pixel text-nintendo-dark leading-snug break-words">
            {onSaleText}
          </p>
        </div>
      </div>
    </PixelCard>
  );
}
