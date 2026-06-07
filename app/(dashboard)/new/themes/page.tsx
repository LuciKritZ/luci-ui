import { Metadata } from 'next';
import React from 'react';

import { NewThemesView } from '@/components/pages/new/themes.view';

export const metadata: Metadata = {
  title: 'Generate Themes | Luci UI',
};

export default function NewThemesPage() {
  return <NewThemesView />;
}
