import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { t } from '@/i18n/es-MX';

export const metadata: Metadata = {
  // The panel must never appear in search results.
  robots: { index: false, follow: false },
};

const navLinkClass =
  'block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

// Neutral layout of the admin panel (D39): the same for every agency.
export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <span className="font-semibold tracking-tight">{t.platform.name}</span>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col md:flex-row">
        <nav
          aria-label={t.admin.nav.label}
          className="border-b border-neutral-200 p-4 md:w-56 md:shrink-0 md:border-r md:border-b-0"
        >
          <ul className="flex gap-1 md:flex-col">
            <li>
              <Link href="/admin" className={navLinkClass}>
                {t.admin.nav.home}
              </Link>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
