import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductShell } from '@/components/product-shell';

const pages: Record<string, { label: string; title: string; description: string; points: string[] }> = {
  about: {
    label: 'Company',
    title: 'A calmer way to move your career forward.',
    description: 'Career Scout helps professionals find relevant opportunities, prepare stronger applications, and make progress with clear next steps.',
    points: ['Explainable job matching', 'A reusable Career Passport', 'Practical application and interview support']
  },
  careers: {
    label: 'Company',
    title: 'Build the future of career mobility.',
    description: 'We are building tools that make professional opportunity more accessible across Africa and beyond.',
    points: ['Product and engineering roles', 'Remote-friendly collaboration', 'Work with a mission-driven team']
  },
  privacy: {
    label: 'Legal',
    title: 'Privacy at Career Scout.',
    description: 'Your profile and application data should help you, not surprise you. Career Scout uses account data to provide matching, coaching, and tracking features.',
    points: ['You control your Career Passport', 'Authentication is handled by Supabase Auth', 'Your data is protected by row-level security policies']
  },
  terms: {
    label: 'Legal',
    title: 'Terms of Service.',
    description: 'Career Scout provides career discovery and preparation tools. Job seekers should independently verify employers, job details, and application requirements before applying.',
    points: ['Use accurate account information', 'Do not misuse or scrape the service', 'Report suspicious listings promptly']
  },
  help: {
    label: 'Support',
    title: 'How can we help?',
    description: 'Start with your Career Passport, then use matching, applications, CV Builder, and Interview Prep to organize your search.',
    points: ['Complete your profile for better matches', 'Save applications as you progress', 'Use the assistant when you need a next step']
  },
  contact: {
    label: 'Support',
    title: 'Contact Career Scout.',
    description: 'For account, support, or partnership questions, send us a message and include the page or workflow where you need help.',
    points: ['Account and authentication support', 'Employer and partnership enquiries', 'Feedback about product workflows']
  },
  'anti-scam': {
    label: 'Safety',
    title: 'Stay safe while job hunting.',
    description: 'Never pay to apply for a job, share passwords, or send sensitive financial information to an unverified recruiter.',
    points: ['Verify the employer domain and company identity', 'Be cautious of urgent payment or fee requests', 'Report suspicious listings through the platform']
  }
};

export default async function InfoPage({ params }: { params: { slug: string } }) {
  const page = pages[params.slug];
  if (!page) notFound();

  return (
    <ProductShell sectionLabel={page.label} title={page.title} subtitle={page.description} actions={<Link href="/" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm">Back home</Link>}>
      <section className="mx-auto max-w-3xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(15,23,20,0.04)] sm:p-8">
        <ul className="space-y-4">
          {page.points.map((point) => <li key={point} className="flex gap-3 text-sm leading-7 text-slate-700"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />{point}</li>)}
        </ul>
        {params.slug === 'contact' ? <a href="mailto:hello@careerscout.example" className="mt-8 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Email support</a> : null}
      </section>
    </ProductShell>
  );
}
