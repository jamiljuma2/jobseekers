import { redirect } from 'next/navigation';
import { ProductShell } from '@/components/product-shell';
import { CvBuilderWorkspace } from '@/components/cv-builder-workspace';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function CvBuilderPage() {
  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) redirect('/auth/login?next=/cv-builder');

  const [{ data: user }, { data: profile }] = await Promise.all([
    supabase.from('users').select('full_name').eq('id', auth.user.id).maybeSingle(),
    supabase.from('career_profiles').select('headline, summary, target_roles').eq('user_id', auth.user.id).maybeSingle()
  ]);

  return (
    <ProductShell
      sectionLabel="CV Builder"
      title="Turn your experience into a focused CV."
      subtitle="Write once, tailor thoughtfully, and keep your strongest professional story connected to your Career Passport."
    >
      <CvBuilderWorkspace
        initialName={user?.full_name ?? ''}
        initialHeadline={profile?.headline ?? ''}
        initialSummary={profile?.summary ?? ''}
        initialRoles={profile?.target_roles?.join(', ') ?? ''}
      />
    </ProductShell>
  );
}
