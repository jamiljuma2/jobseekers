import type { ReactNode } from 'react';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ProductNav } from '@/components/product-nav';

type ShellStat = {
  label: string;
  value: string;
  detail?: string;
};

type NavItem = {
  label: string;
  href: string;
};

type ProductShellProps = {
  title: string;
  subtitle: string;
  sectionLabel?: string;
  actions?: ReactNode;
  stats?: ShellStat[];
  navItems?: NavItem[];
  children: ReactNode;
};

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'Career Passport', href: '/career-passport' },
  { label: 'CV Builder', href: '/cv-builder' },
  { label: 'Applications', href: '/applications' },
  { label: 'AI Assistant', href: '/assistant' },
  { label: 'Interview Prep', href: '/interview-prep' }
];

export async function ProductShell({
  title,
  subtitle,
  sectionLabel = 'AI Career Scout',
  actions,
  stats = [],
  navItems = defaultNavItems,
  children
}: ProductShellProps) {
  let isAuthenticated = false;

  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    isAuthenticated = Boolean(data.user);
  } catch {
    isAuthenticated = false;
  }

  return (
    <main className="min-h-screen bg-[#f8fbf8] text-ink">
      <header className="sticky top-0 z-20 border-b border-emerald-950/8 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-8">
          <a href="/" className="flex items-center gap-3 text-slate-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-bold text-white shadow-[0_10px_24px_rgba(16,185,129,0.25)]">S</span>
            <span className="text-lg font-semibold tracking-tight">Career Scout</span>
          </a>

          <ProductNav items={navItems} />

          <div className="ml-auto flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 sm:px-4">
                  Dashboard
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button type="submit" className="inline-flex rounded-full bg-slate-950 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 sm:px-4">
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <Link href="/auth/login" className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 sm:px-4">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section>
          <div className="border-b border-slate-200/80 pb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-600">{sectionLabel}</p>
                <h1 className="max-w-4xl text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.8rem]">{title}</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-[1.02rem]">{subtitle}</p>
              </div>

              {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>

            {stats.length > 0 ? (
              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <article key={stat.label} className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,20,0.04)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600/75">{stat.label}</p>
                    <p className="mt-2 text-[1.65rem] font-semibold tracking-tight text-slate-950">{stat.value}</p>
                    {stat.detail ? <p className="mt-1 text-sm leading-6 text-slate-600">{stat.detail}</p> : null}
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          <div className="pt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
