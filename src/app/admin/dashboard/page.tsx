import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ProductShell } from '@/components/product-shell';
import { isAdminUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect('/auth/login?next=/admin/dashboard');
  }

  if (!isAdminUser(auth.user)) {
    redirect('/dashboard');
  }

  const [{ count: users }, { count: jobs }, { count: applications }, { count: reports }] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('jobs').select('id', { count: 'exact', head: true }),
    supabase.from('applications').select('id', { count: 'exact', head: true }),
    supabase.from('job_reports').select('id', { count: 'exact', head: true })
  ]);

  const metrics: Array<{ label: string; value: number | null }> = [
    { label: 'Registered users', value: users },
    { label: 'Published jobs', value: jobs },
    { label: 'Applications', value: applications },
    { label: 'Open reports', value: reports }
  ];

  return (
    <ProductShell
      sectionLabel="Admin operations"
      title="Keep the career marketplace healthy."
      subtitle="Monitor platform activity, review trust signals, and maintain the quality of opportunities available to job seekers."
      actions={<Link href="/jobs" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm">View marketplace</Link>}
      stats={metrics.map(({ label, value }) => ({ label, value: value === null ? 'Unavailable' : String(value), detail: 'Live database count' }))}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(15,23,20,0.04)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Operations checklist</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Review what needs attention.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ['Job quality', 'Review reported or suspicious listings.', '/admin/reports'],
              ['Employer trust', 'Verify new employers before promotion.', '/admin/employers'],
              ['User support', 'Review account and profile issues.', '/admin/users'],
              ['Content health', 'Keep recommendations current and relevant.', '/jobs']
            ].map(([title, detail, href]) => <Link key={title} href={href} className="rounded-[1.25rem] border border-slate-100 bg-[#fbfdfb] p-5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm"><p className="text-sm font-semibold text-slate-950">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p><span className="mt-4 inline-flex text-sm font-semibold text-emerald-600">Open →</span></Link>)}
          </div>
        </section>

        <aside className="rounded-[1.75rem] bg-emerald-950 p-6 text-white shadow-[0_12px_35px_rgba(6,78,59,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Admin access</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">{auth.user.email}</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">This dashboard is protected by the server-side admin allowlist. User-facing pages remain isolated from operational controls.</p>
          <div className="mt-6 rounded-[1.25rem] bg-white/10 p-4"><p className="text-sm text-white/75">Reports requiring review</p><p className="mt-2 text-3xl font-semibold">{reports === null ? 'Unavailable' : reports}</p></div>
        </aside>
      </div>
    </ProductShell>
  );
}
