import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ProductShell } from '@/components/product-shell';
import { isAdminUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect('/auth/login?next=/dashboard');
  }

  if (isAdminUser(auth.user)) {
    redirect('/admin/dashboard');
  }

  const [{ data: profile }, { data: applications }] = await Promise.all([
    supabase.from('career_profiles').select('profile_completeness, headline, target_roles').eq('user_id', auth.user.id).maybeSingle(),
    supabase.from('applications').select('id, status, interview_at, follow_up_at').eq('user_id', auth.user.id)
  ]);

  const applicationRows = applications ?? [];
  const interviews = applicationRows.filter((application) => application.interview_at).length;
  const followUps = applicationRows.filter((application) => application.follow_up_at).length;
  const completion = profile?.profile_completeness ?? 0;

  return (
    <ProductShell
      sectionLabel="Personal dashboard"
      title="Your job search, in one clear view."
      subtitle="Track real applications, improve your profile, and keep the next useful action visible."
      actions={<Link href="/jobs" className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.24)]">Find jobs</Link>}
      stats={[
        { label: 'Applications', value: String(applicationRows.length), detail: 'Saved and active applications' },
        { label: 'Interviews', value: String(interviews), detail: 'Applications with an interview date' },
        { label: 'Follow-ups', value: String(followUps), detail: 'Applications with a follow-up date' },
        { label: 'Profile strength', value: `${completion}%`, detail: completion ? 'Based on your Career Passport' : 'Complete your Career Passport' }
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(15,23,20,0.04)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Next step</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{completion < 70 ? 'Strengthen your Career Passport' : 'Review your best-fit jobs'}</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{completion < 70 ? 'A more complete profile gives the matching engine better evidence for recommendations and applications.' : 'Use your match explanations to choose fewer, stronger opportunities.'}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{completion}% complete</span>
          </div>
          <div className="mt-6 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.min(completion, 100)}%` }} /></div>
          <Link href={completion < 70 ? '/career-passport' : '/jobs'} className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">{completion < 70 ? 'Complete passport' : 'Explore matches'}</Link>
        </section>

        <aside className="rounded-[1.75rem] bg-emerald-950 p-6 text-white shadow-[0_12px_35px_rgba(6,78,59,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Your focus</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Make the next application count.</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">Career Scout turns your profile and application history into practical next steps. Nothing is added here until you create it.</p>
          <div className="mt-6 flex flex-wrap gap-3"><Link href="/assistant" className="rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white">Ask AI Coach</Link><Link href="/interview-prep" className="rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white">Practice interview</Link></div>
        </aside>
      </div>

      <section className="mt-8 border-t border-slate-200/80 pt-8">
        <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Activity</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Your applications</h2></div><Link href="/applications" className="text-sm font-semibold text-emerald-600">Open tracker →</Link></div>
        {applicationRows.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{applicationRows.slice(0, 6).map((application) => <article key={application.id} className="rounded-[1.25rem] border border-slate-200 bg-white p-5"><p className="text-sm font-semibold text-slate-950">Application {application.id.slice(0, 8)}</p><p className="mt-2 text-sm capitalize text-slate-500">{String(application.status ?? 'saved').replace('_', ' ')}</p></article>)}</div> : <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-8 text-center"><p className="text-sm text-slate-600">No applications yet.</p><Link href="/jobs" className="mt-4 inline-flex rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white">Find your first opportunity</Link></div>}
      </section>
    </ProductShell>
  );
}
