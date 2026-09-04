import { badRequest, getAuthedSupabase, jsonResponse, unauthorized } from '@/lib/supabase/route';

export async function POST(request: Request) {
  const { supabase, user } = await getAuthedSupabase();
  if (!user) return unauthorized('Sign in to use Career Scout AI.');
  const body = await request.json().catch(() => null) as { prompt?: unknown } | null;
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) return badRequest('Ask a career question first.');

  const [{ data: profile }, { data: applications }] = await Promise.all([
    supabase.from('career_profiles').select('headline, target_roles, target_locations, profile_completeness').eq('user_id', user.id).maybeSingle(),
    supabase.from('applications').select('id').eq('user_id', user.id)
  ]);
  const role = profile?.target_roles?.[0] ?? profile?.headline ?? 'your target role';
  const lowerPrompt = prompt.toLowerCase();
  const answer = lowerPrompt.includes('cv')
    ? `For ${role}, lead with measurable outcomes, mirror the target job language, and place your strongest evidence in the top third of the CV. Your Career Passport is ${profile?.profile_completeness ?? 0}% complete, so quantified experience will make the guidance more specific.`
    : lowerPrompt.includes('job') || lowerPrompt.includes('role')
      ? `Start with roles aligned to ${role}${profile?.target_locations?.length ? ` in ${profile.target_locations.join(', ')}` : ''}. Compare each match explanation before applying, then save the opportunity so your next step is tracked.`
      : `Connect your question to a specific role, CV, or application and I can make the next step concrete. You currently have ${applications?.length ?? 0} tracked applications.`;

  return jsonResponse({ answer, context: { profileCompleteness: profile?.profile_completeness ?? 0, applications: applications?.length ?? 0 } });
}
