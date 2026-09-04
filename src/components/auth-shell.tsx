import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  footerText: string;
  footerHref: string;
  footerLabel: string;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  footerText,
  footerHref,
  footerLabel,
  children
}: AuthShellProps) {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,_#eef4ef_0%,_#e5ede6_100%)]" />
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <div className="flex flex-col justify-between rounded-[2rem] bg-[#dfe8e1] p-8 text-slate-950 shadow-[10px_10px_24px_rgba(163,177,198,0.34),-10px_-10px_24px_rgba(255,255,255,0.86)]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700/75">{eyebrow}</p>
            <h1 className="mt-4 max-w-xl text-[2.6rem] font-semibold tracking-tight text-balance sm:text-[3.4rem]">
              AI Career Scout keeps your job search focused on quality.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-8 text-slate-700">
              Build a reusable Career Passport, get explainable match scores, tailor applications, and prepare for interviews
              without spreading your workflow across a dozen tools.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              ['Explainable matching', 'Why apply, what fits, and what is missing.'],
              ['Mobile-first workflow', 'Built for users who search and apply from phones.'],
              ['Scam-aware discovery', 'Flag risky jobs before you waste time.'],
              ['Career coaching', 'Assistant, tailoring, and interview prep in one place.']
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-[#edf4ee] p-4 shadow-[inset_6px_6px_12px_rgba(163,177,198,0.18),inset_-6px_-6px_12px_rgba(255,255,255,0.9)]">
                <p className="text-sm font-semibold tracking-tight text-slate-950">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-xl rounded-[2rem] bg-[#e9f0eb] p-8 shadow-[10px_10px_24px_rgba(163,177,198,0.32),-10px_-10px_24px_rgba(255,255,255,0.82)]">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700">{eyebrow}</p>
              <h2 className="text-[2rem] font-semibold tracking-tight text-ink sm:text-[2.5rem]">{title}</h2>
              <p className="max-w-lg text-base leading-8 text-slate-700">{subtitle}</p>
            </div>

            <div className="mt-8">{children}</div>

            <p className="mt-8 text-sm leading-7 text-slate-600">
              {footerText}{' '}
              <Link href={footerHref} className="font-semibold text-emerald-700 underline decoration-emerald-400/45 underline-offset-4 hover:decoration-emerald-500">
                {footerLabel}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
