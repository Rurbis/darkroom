import type { Metadata } from 'next';

import { t } from '@/i18n/es-MX';

export const metadata: Metadata = {
  title: t.admin.home.title,
};

// Placeholder until #20 shows the owner's profile and agency from the API.
export default function AdminHomePage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">{t.admin.home.title}</h1>
      <p className="mt-2 text-neutral-600">{t.admin.home.placeholder}</p>
    </section>
  );
}
