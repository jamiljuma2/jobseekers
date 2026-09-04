import Link from 'next/link';
import { ProductShell } from '@/components/product-shell';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'A focused starting point for exploring better opportunities.',
    features: ['Browse published jobs', 'Create a Career Passport', 'Track applications', 'Basic match context'],
    action: 'Start free',
    href: '/auth/register',
    featured: false
  },
  {
    name: 'Scout Pro',
    price: '$9',
    description: 'More guidance and preparation for an active job search.',
    features: ['Everything in Free', 'AI career guidance', 'CV tailoring support', 'Interview practice feedback'],
    action: 'Get started',
    href: '/auth/register',
    featured: true
  },
  {
    name: 'Teams',
    price: 'Custom',
    description: 'Career programs and talent teams supporting multiple professionals.',
    features: ['Cohort management', 'Program reporting', 'Employer workflows', 'Dedicated support'],
    action: 'Contact us',
    href: 'mailto:hello@careerscout.example',
    featured: false
  }
];

export default function PricingPage() {
  return (
    <ProductShell
      sectionLabel="Pricing"
      title="Simple plans for every stage of your search."
      subtitle="Start with the tools you need today and grow into more guidance when your search becomes more active."
      actions={<Link href="/auth/login" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm">Sign in</Link>}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className={`relative flex flex-col rounded-[1.75rem] border p-6 ${plan.featured ? 'border-emerald-400 bg-emerald-950 text-white shadow-[0_18px_50px_rgba(6,78,59,0.24)]' : 'border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,20,0.04)]'}`}>
            {plan.featured ? <span className="absolute right-5 top-5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">Recommended</span> : null}
            <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${plan.featured ? 'text-emerald-300' : 'text-emerald-600'}`}>{plan.name}</p>
            <p className="mt-5 text-4xl font-semibold tracking-tight">{plan.price}<span className={`text-sm font-normal ${plan.featured ? 'text-white/60' : 'text-slate-500'}`}>{plan.price.startsWith('$') ? ' / month' : ''}</span></p>
            <p className={`mt-4 min-h-14 text-sm leading-7 ${plan.featured ? 'text-white/70' : 'text-slate-600'}`}>{plan.description}</p>
            <ul className={`mt-6 flex-1 space-y-3 text-sm ${plan.featured ? 'text-white/80' : 'text-slate-700'}`}>
              {plan.features.map((feature) => <li key={feature} className="flex gap-3"><span className={plan.featured ? 'text-emerald-300' : 'text-emerald-600'}>✓</span><span>{feature}</span></li>)}
            </ul>
            <Link href={plan.href} className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${plan.featured ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-slate-950 text-white hover:bg-slate-800'}`}>{plan.action}</Link>
          </article>
        ))}
      </div>

      <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center shadow-[0_8px_20px_rgba(15,23,20,0.04)]">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Plans are designed to keep your search focused.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">Your Career Passport and application data stay connected as you move between plans. You can begin without entering payment details.</p>
      </section>
    </ProductShell>
  );
}
