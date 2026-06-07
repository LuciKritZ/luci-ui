import { Metadata } from 'next';
import React from 'react';

import { ThemesView } from '@/components/pages/themes/themes.view';

export const metadata: Metadata = {
  title: 'Themes | Luci UI',
};

export default function ThemesPage() {
  return <ThemesView />;
}
