import { t } from '@/i18n/es-MX';

// Placeholder: the public site of each agency replaces this page in milestone 2.
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-2 px-4">
      <h1 className="text-3xl font-semibold tracking-tight">{t.platform.name}</h1>
      <p className="text-neutral-600">{t.home.description}</p>
    </main>
  );
}
