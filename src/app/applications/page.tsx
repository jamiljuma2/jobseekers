import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ProductShell } from '@/components/product-shell';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const stages = ['saved', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'];

export default async function ApplicationsPage() {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/auth/login?next=/applications');
  const { data: applications, error } = await supabase.from('applications').select('id, status, notes, updated_at, job:jobs(title, location, employers(name))').eq('user_id', auth.user.id).order('updated_at', { ascending: false });
  type EmployerView = { name?: string };
  type JobView = { title?: string; location?: string; employers?: EmployerView | EmployerView[] | null };
  type ApplicationView = { id: string; status: string; job?: JobView | JobView[] | null };
  const rows = (applications ?? []) as ApplicationView[];
  const count = (status: string) => rows.filter((application) => application.status === status).length;

  return <ProductShell sectionLabel="Application tracker" title="Follow every opportunity through." subtitle="Keep your real applications organized, with one clear status and next action for each role." actions={<Link href="/jobs" className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white">Find jobs</Link>} stats={[{ label: 'Total', value: String(rows.length), detail: 'Applications you have created' }, { label: 'Active', value: String(rows.filter((row) => !['rejected', 'withdrawn'].includes(row.status)).length), detail: 'Still moving through the process' }, { label: 'Interviews', value: String(count('interview')), detail: 'Applications at interview stage' }, { label: 'Offers', value: String(count('offer')), detail: 'Offers recorded in your tracker' }]}>
    {error ? <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">Applications could not be loaded: {error.message}</div> : <div className="grid gap-4 overflow-x-auto pb-2 lg:grid-cols-7 lg:overflow-visible">{stages.map((stage) => { const stageRows = rows.filter((row) => row.status === stage); return <section key={stage} className="min-w-[14rem] rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,20,0.04)]"><h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">{stage}</h2><div className="mt-4 space-y-3">{stageRows.length ? stageRows.map((application) => { const job = Array.isArray(application.job) ? application.job[0] : application.job; const employerRelation = job?.employers; const employerName = Array.isArray(employerRelation) ? employerRelation[0]?.name : employerRelation?.name; return <article key={application.id} className="rounded-xl border border-slate-100 bg-[#fbfdfb] p-4"><p className="text-sm font-semibold text-slate-950">{job?.title ?? 'Untitled role'}</p><p className="mt-1 text-xs text-slate-500">{employerName ?? 'Employer not provided'}</p><Link href={`/applications/${application.id}`} className="mt-3 inline-flex text-xs font-semibold text-emerald-600">Open application →</Link></article>; }) : <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">No applications</p>}</div></section>; })}</div>}
  </ProductShell>;
}
