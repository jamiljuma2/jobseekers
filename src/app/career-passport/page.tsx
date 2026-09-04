import { redirect } from 'next/navigation';
import { ProductShell } from '@/components/product-shell';
import { CareerPassportWorkspace } from '@/components/career-passport-workspace';
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

  return <ProductShell sectionLabel="Career Passport" title="Your reusable professional profile." subtitle="Keep the information behind your applications accurate, structured, and ready to tailor." stats={[{ label: 'Completeness', value: `${completion}%`, detail: completion ? 'Calculated from your profile records' : 'Add profile information to begin' }, { label: 'Experience', value: String(experiences?.length ?? 0), detail: 'Saved experience records' }, { label: 'Skills', value: String(skills?.length ?? 0), detail: 'Saved skills' }, { label: 'Projects', value: String(projects?.length ?? 0), detail: 'Saved projects' }]}>
    <CareerPassportWorkspace initialHeadline={profile?.headline ?? ''} initialSummary={profile?.summary ?? ''} initialRoles={profile?.target_roles?.join(', ') ?? ''} initialLocations={profile?.target_locations?.join(', ') ?? ''} />
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{sections.map(({ name, count }) => <article key={name} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,20,0.04)]"><h2 className="text-lg font-semibold text-slate-950">{name}</h2><p className="mt-2 text-sm text-slate-600">{count} record{count === 1 ? '' : 's'} saved</p><p className="mt-4 text-sm text-slate-500">Manage this section from your profile editor.</p></article>)}</div>
  </ProductShell>;
}
