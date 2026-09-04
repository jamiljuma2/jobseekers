import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ProductShell } from '@/components/product-shell';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function ApplicationDetailPage({ params }: { params: { applicationId: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`/auth/login?next=/applications/${params.applicationId}`);
  const { data: application } = await supabase.from('applications').select('id, status, notes, contact_person_name, contact_person_email, interview_at, follow_up_at, applied_at, job:jobs(title, location, employers(name))').eq('id', params.applicationId).eq('user_id', auth.user.id).maybeSingle();
  if (!application) notFound();
  type EmployerView = { name?: string };
  type JobView = { title?: string; location?: string; employers?: EmployerView | EmployerView[] | null };
  const job = (Array.isArray(application.job) ? application.job[0] : application.job) as JobView | null;
  const employerRelation = job?.employers;
  const employerName = Array.isArray(employerRelation) ? employerRelation[0]?.name : employerRelation?.name;

  return <ProductShell sectionLabel="Application detail" title={job?.title ?? 'Application'} subtitle={`${employerName ?? 'Employer not provided'} · ${job?.location ?? 'Location not provided'}`} actions={<Link href="/applications" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900">Back to tracker</Link>}><div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Current status</p><p className="mt-3 text-3xl font-semibold capitalize text-slate-950">{application.status}</p><dl className="mt-8 grid gap-4 sm:grid-cols-2">{[['Applied', application.applied_at], ['Interview', application.interview_at], ['Follow-up', application.follow_up_at], ['Contact', application.contact_person_name]].map(([label, value]) => <div key={label}><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</dt><dd className="mt-1 text-sm text-slate-700">{value ? String(value) : 'Not recorded'}</dd></div>)}</dl></section><aside className="rounded-[1.75rem] bg-emerald-950 p-6 text-white"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Notes</p><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/75">{application.notes ?? 'No notes added yet.'}</p><Link href="/interview-prep" className="mt-6 inline-flex rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white">Prepare for interview</Link></aside></div></ProductShell>;
}
