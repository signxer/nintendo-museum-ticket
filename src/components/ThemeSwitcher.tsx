import React from 'react';
import { useTranslation } from 'react-i18next';
import { Palette } from 'lucide-react';
import { PixelButton } from './PixelButton';
import type { Theme } from '../hooks/useTheme';

interface ThemeSwitcherProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeSwitcher({ theme, onToggle }: ThemeSwitcherProps) {
  const { t } = useTranslation();

  return (
    <PixelButton
      variant="outline"
      size="sm"
      onClick={onToggle}
      aria-label={t('common.theme')}
      title={t('common.theme')}
      className="flex items-center gap-1.5"
    >
      <Palette className="w-3.5 h-3.5" />
      {theme === 'pixel' ? t('common.themePixel') : t('common.themeOfficial')}
    </PixelButton>
  );
}
