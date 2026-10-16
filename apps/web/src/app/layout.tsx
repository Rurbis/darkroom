import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { t } from '@/i18n/es-MX';

import './globals.css';

export const metadata: Metadata = {
  // Pages set only their own title; Next adds the platform name. A template
  // applies to child segments, so it lives here rather than in /admin.
  title: { template: `%s · ${t.platform.name}`, default: t.platform.name },
  description: t.home.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
