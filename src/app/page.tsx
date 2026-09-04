import Link from 'next/link';
import { ProductShell } from '@/components/product-shell';

const highlights = [
  'AI match scores with explanations, not black-box rankings.',
  'Career Passport that turns one profile into tailored applications.',
  'Application tracking, interview prep, and scam protection in one place.'
];

const phaseCards = [
  {
    title: 'Foundation',
    detail: 'Auth, onboarding, dashboard shell, Career Passport, and mobile-first landing experience.'
  },
  {
    title: 'Core Discovery',
    detail: 'CV upload, parsing, job search, filters, and high-signal job detail pages.'
  },
  {
    title: 'AI Application Layer',
    detail: 'Match scoring, CV tailoring, cover letters, and application tracking.'
  },
  {
    title: 'Intelligence & Coaching',
    detail: 'Career assistant, interview prep, alerts, and personalized guidance.'
  }
];

export default function HomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <ProductShell
      sectionLabel="AI-powered career growth"
      title="Find the right job. Apply smarter. Get hired."
      subtitle="AI-powered job discovery, personalized applications, CV optimization and interview preparation — all in one place. Built for the next generation of African professionals."
      actions={
        <Link href="/auth/register" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-700">
          Start Your Job Search
        </Link>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,20,0.06)]">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-sm font-medium text-slate-500">Stop guessing. Start applying with confidence using our AI-driven toolkit.</p>
              <h2 className="mt-6 max-w-2xl text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.6rem]">
                Everything you need to land your dream role
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                AI job matching, personalized CVs, interview prep, and application tracking in one quiet, focused workspace.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.75rem] bg-emerald-950 p-6 text-white shadow-[0_18px_50px_rgba(6,78,59,0.28)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300/80">Career Passport</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">Your permanent professional identity.</h3>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Upload your CV once, and AI keeps it updated across applications with explainable enhancements.
              </p>

              <Link href="/career-passport" className="mt-8 inline-flex rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white">Build your passport</Link>
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,20,0.06)]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {[
              ['AI Job Match Score', 'Instantly see how your profile aligns and where the gaps are.'],
              ['CV Tailoring', 'Automatically optimize your CV for every specific role.'],
              ['Interview Coach', 'Practice with mock interviews and structured feedback.'],
              ['Application Tracker', 'Keep every application, interview, and follow-up in one place.']
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-100 bg-[#fbfdfb] p-5 shadow-[0_8px_20px_rgba(15,23,20,0.04)]">
                <p className="text-sm font-semibold text-slate-950">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="border-t border-slate-200/80 pt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[1.75rem] font-semibold tracking-tight text-slate-950 sm:text-[2.25rem]">Featured Opportunities</h2>
            <p className="mt-2 text-base text-slate-500">Hand-picked roles across African markets.</p>
          </div>
          <Link href="/jobs" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700">
            View All Jobs
          </Link>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-10 text-center"><p className="text-sm text-slate-600">Live opportunities appear here from the marketplace.</p><Link href="/jobs" className="mt-4 inline-flex rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white">Browse live jobs</Link></div>
      </section>

      <section className="border-t border-slate-200/80 pt-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-[1.75rem] font-semibold tracking-tight text-slate-950 sm:text-[2.25rem]">Simple, transparent pricing</h2>
          <p className="max-w-2xl text-base text-slate-500">Start for free and upgrade as you scale your job search.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700">
              View Pricing
            </Link>
            <Link href="/auth/register" className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-600">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-emerald-950 px-6 py-10 text-white shadow-[0_18px_50px_rgba(6,78,59,0.28)]">
        <div className="grid gap-8 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-bold text-white">S</span>
              <span className="text-xl font-semibold">Career Scout</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
              Empowering African professionals to find global opportunities through artificial intelligence.
            </p>
          </div>

          {[
            ['Product', [['Find Jobs', '/jobs'], ['Career Passport', '/career-passport'], ['CV Builder', '/cv-builder'], ['Interview Prep', '/interview-prep']]],
            ['Company', [['About Us', '/info/about'], ['Careers', '/info/careers'], ['Privacy Policy', '/info/privacy'], ['Terms of Service', '/info/terms']]],
            ['Support', [['Help Center', '/info/help'], ['Contact Us', '/info/contact'], ['Anti-Scam Guide', '/info/anti-scam']]]
          ].map(([title, items]) => (
            <div key={String(title)}>
              <p className="text-lg font-semibold">{title}</p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                {(items as [string, string][]).map(([label, href]) => (
                  <li key={href}><Link href={href} className="transition hover:text-emerald-300 hover:underline hover:underline-offset-4">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-white/10 pt-5 text-sm text-white/55">
          <p>© {currentYear} Career Scout. All rights reserved.</p>
        </div>
      </footer>
    </ProductShell>
  );
}
