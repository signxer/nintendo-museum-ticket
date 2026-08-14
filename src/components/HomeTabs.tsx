import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, CalendarRange } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PixelButton } from './PixelButton';
import { TicketCalculator } from './TicketCalculator';
import { ReleaseScheduleCard } from './ReleaseScheduleCard';

type ToolTab = 'calculator' | 'schedule';

/**
 * Tabbed "tools" panel (calculator / release schedule) so the desktop home
 * page uses horizontal space instead of a long single column. Both panels
 * stay mounted (toggled with `hidden`) so calculator state survives tab
 * switches.
 */
export function HomeTabs() {
  const { t } = useTranslation();
  const [active, setActive] = useState<ToolTab>('calculator');

  const tabs: { id: ToolTab; label: string; icon: LucideIcon }[] = [
    { id: 'calculator', label: t('home.calculator'), icon: Calculator },
    { id: 'schedule', label: t('home.releaseOverview'), icon: CalendarRange },
  ];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const index = tabs.findIndex((tab) => tab.id === active);
    let next: ToolTab | null = null;
    if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length].id;
    else if (e.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length].id;
    if (next) {
      e.preventDefault();
      setActive(next);
    }
  };

  return (
    <div>
      <div role="tablist" aria-label={t('home.tools')} className="flex flex-wrap justify-center gap-2" onKeyDown={onKeyDown}>
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <PixelButton
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              variant={isActive ? 'primary' : 'outline'}
              size="md"
              className="h-10 flex items-center"
              onClick={() => setActive(tab.id)}
            >
              <tab.icon className="w-4 h-4 mr-1.5 shrink-0" />
              {tab.label}
            </PixelButton>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="panel-calculator"
        aria-labelledby="tab-calculator"
        className={active === 'calculator' ? 'mt-6' : 'mt-6 hidden'}
        tabIndex={0}
      >
        <TicketCalculator />
      </div>

      <div
        role="tabpanel"
        id="panel-schedule"
        aria-labelledby="tab-schedule"
        className={active === 'schedule' ? 'mt-6' : 'mt-6 hidden'}
        tabIndex={0}
      >
        <ReleaseScheduleCard />
      </div>
    </div>
  );
}
