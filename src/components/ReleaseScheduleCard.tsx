import React, { useMemo } from 'react';
import { addMonths } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { PixelCard } from './PixelCard';
import { getReleaseDateTimeForVisitMonth } from '../utils/ticketLogic';
import { getLotteryScheduleForVisit } from '../utils/lotteryLogic';
import { getJSTMonth } from '../utils/timezoneUtils';
import { useTimezone } from '../hooks/useTimezone';

/**
 * An at-a-glance schedule of the next few releases: for each upcoming visit
 * month, the lottery entry / result dates and the first-come sale time.
 * Rows whose sale already started are dimmed.
 */
export function ReleaseScheduleCard() {
  const { t, i18n } = useTranslation();
  const { timezone } = useTimezone();

  const rows = useMemo(() => {
    const jstMonth = getJSTMonth(new Date());
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const visit = addMonths(jstMonth, 2 + i);
      const firstCome = getReleaseDateTimeForVisitMonth(visit.getFullYear(), visit.getMonth());
      const lottery = getLotteryScheduleForVisit(visit.getFullYear(), visit.getMonth());
      return { visit, firstCome, lottery, done: firstCome <= now };
    });
  }, []);

  const formatDateTime = (date: Date) =>
    new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(date);

  const formatMonth = (date: Date) =>
    new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'short',
      timeZone: timezone,
    }).format(date);

  return (
    <PixelCard title={t('home.releaseOverview')} className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b-4 border-nintendo-grey">
              <th className="py-2 pr-3 font-pixel text-nintendo-grey whitespace-nowrap">{t('home.visitMonth')}</th>
              <th className="nm-lottery py-2 pr-3 font-pixel text-nintendo-grey whitespace-nowrap">{t('home.lotteryEntry')}</th>
              <th className="nm-lottery py-2 pr-3 font-pixel text-nintendo-grey whitespace-nowrap">{t('home.lotteryResult')}</th>
              <th className="nm-sale py-2 font-pixel text-nintendo-grey whitespace-nowrap">{t('home.firstCome')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.visit.getTime()}
                className={`border-b-2 border-dashed border-nintendo-grey/50 ${row.done ? 'opacity-50' : ''}`}
              >
                <td className="py-2 pr-3 font-pixel text-nintendo-dark whitespace-nowrap">{formatMonth(row.visit)}</td>
                <td className="py-2 pr-3 whitespace-nowrap">{formatDateTime(row.lottery.entryOpen)}</td>
                <td className="py-2 pr-3 whitespace-nowrap">{formatDateTime(row.lottery.result)}</td>
                <td className="nm-sale py-2 font-pixel text-nintendo-red whitespace-nowrap">{formatDateTime(row.firstCome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PixelCard>
  );
}
