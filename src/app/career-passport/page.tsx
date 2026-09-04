import { redirect } from 'next/navigation';
import { ProductShell } from '@/components/product-shell';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function CareerPassportPage() {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect('/auth/login?next=/career-passport');
  const [{ data: profile }, { data: experiences }, { data: education }, { data: skills }, { data: certifications }, { data: projects }] = await Promise.all([
    supabase.from('career_profiles').select('profile_completeness, headline, summary, target_roles, target_locations').eq('user_id', auth.user.id).maybeSingle(),
    supabase.from('experiences').select('id').eq('user_id', auth.user.id),
    supabase.from('education').select('id').eq('user_id', auth.user.id),
    supabase.from('skills').select('id').eq('user_id', auth.user.id),
    supabase.from('certifications').select('id').eq('user_id', auth.user.id),
    supabase.from('projects').select('id').eq('user_id', auth.user.id)
  ]);
  const completion = profile?.profile_completeness ?? 0;
  const sections: Array<{ name: string; count: number }> = [
    { name: 'Experience', count: experiences?.length ?? 0 },
    { name: 'Education', count: education?.length ?? 0 },
    { name: 'Skills', count: skills?.length ?? 0 },
    { name: 'Certifications', count: certifications?.length ?? 0 },
    { name: 'Projects', count: projects?.length ?? 0 }
  ];

  return <ProductShell sectionLabel="Career Passport" title="Your reusable professional profile." subtitle="Keep the information behind your applications accurate, structured, and ready to tailor." actions={<button className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white">Edit profile</button>} stats={[{ label: 'Completeness', value: `${completion}%`, detail: completion ? 'Calculated from your profile records' : 'Add profile information to begin' }, { label: 'Experience', value: String(experiences?.length ?? 0), detail: 'Saved experience records' }, { label: 'Skills', value: String(skills?.length ?? 0), detail: 'Saved skills' }, { label: 'Projects', value: String(projects?.length ?? 0), detail: 'Saved projects' }]}>
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(15,23,20,0.04)]"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Profile overview</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{profile?.headline ?? 'Add a professional headline'}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{profile?.summary ?? 'Your summary will appear here once you add it to your Career Passport.'}</p><div className="mt-6 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-500" style={{ width: `${Math.min(completion, 100)}%` }} /></div></section><aside className="rounded-[1.75rem] bg-emerald-950 p-6 text-white"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Target direction</p><p className="mt-3 text-lg font-semibold">{profile?.target_roles?.length ? profile.target_roles.join(', ') : 'No target roles added yet'}</p><p className="mt-3 text-sm leading-7 text-white/70">{profile?.target_locations?.length ? profile.target_locations.join(', ') : 'Add preferred locations to improve job matches.'}</p></aside></div>
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{sections.map(({ name, count }) => <article key={name} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,20,0.04)]"><h2 className="text-lg font-semibold text-slate-950">{name}</h2><p className="mt-2 text-sm text-slate-600">{count} record{count === 1 ? '' : 's'} saved</p><button className="mt-4 text-sm font-semibold text-emerald-600">Manage {name.toLowerCase()} →</button></article>)}</div>
  </ProductShell>;
}
