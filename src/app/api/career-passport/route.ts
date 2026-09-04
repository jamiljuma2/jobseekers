import { badRequest, getAuthedSupabase, jsonResponse, unauthorized } from '@/lib/supabase/route';

async function loadPassport(supabase: Awaited<ReturnType<typeof getAuthedSupabase>>['supabase'], userId: string) {
  const [
    { data: profile },
    { data: careerProfile },
    { data: experiences },
    { data: education },
    { data: skills },
    { data: certifications },
    { data: projects }
  ] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).maybeSingle(),
    supabase.from('career_profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('experiences').select('*').eq('user_id', userId).order('sort_order', { ascending: true }),
    supabase.from('education').select('*').eq('user_id', userId).order('sort_order', { ascending: true }),
    supabase.from('skills').select('*').eq('user_id', userId).order('sort_order', { ascending: true }),
    supabase.from('certifications').select('*').eq('user_id', userId).order('sort_order', { ascending: true }),
    supabase.from('projects').select('*').eq('user_id', userId).order('sort_order', { ascending: true })
  ]);

  return {
    profile: profile ?? null,
    career_profile: careerProfile ?? null,
    experiences: experiences ?? [],
    education: education ?? [],
    skills: skills ?? [],
    certifications: certifications ?? [],
    projects: projects ?? []
  };
}

export async function GET() {
  const { supabase, user } = await getAuthedSupabase();

  if (!user) {
    return unauthorized('No active session found.');
  }

  const passport = await loadPassport(supabase, user.id);

  return jsonResponse({
    ...passport,
    completeness: passport.career_profile?.profile_completeness ?? 0
  });
}

export async function PATCH(request: Request) {
  const { supabase, user } = await getAuthedSupabase();

  if (!user) {
    return unauthorized('No active session found.');
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== 'object') {
    return badRequest('Expected a JSON payload.');
  }

  const payload = body as Record<string, unknown>;
  const userUpdates: Record<string, unknown> = {};
  const careerUpdates: Record<string, unknown> = {};

  ['full_name', 'country', 'current_title', 'current_company', 'avatar_url', 'onboarding_completed'].forEach((field) => {
    if (field in payload) {
      userUpdates[field] = payload[field];
    }
  });

  ['headline', 'summary', 'target_roles', 'target_locations', 'employment_preferences', 'profile_completeness'].forEach((field) => {
    if (field in payload) {
      careerUpdates[field] = payload[field];
    }
  });

  if (Object.keys(userUpdates).length > 0) {
    const { error } = await supabase.from('users').upsert({ id: user.id, email: user.email ?? '', ...userUpdates });

    if (error) {
      return jsonResponse({ error: error.message }, { status: 400 });
    }
  }

  if (Object.keys(careerUpdates).length > 0) {
    const { error } = await supabase.from('career_profiles').upsert({ user_id: user.id, ...careerUpdates });

    if (error) {
      return jsonResponse({ error: error.message }, { status: 400 });
    }
  }

  const passport = await loadPassport(supabase, user.id);

  return jsonResponse({
    ...passport,
    completeness: passport.career_profile?.profile_completeness ?? 0
  });
}
