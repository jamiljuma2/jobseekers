import { getAuthedSupabase, jsonResponse, unauthorized } from '@/lib/supabase/route';

export async function GET() {
  const { supabase, user } = await getAuthedSupabase();

  if (!user) {
    return unauthorized('No active session found.');
  }

  const [{ data: profile }, { data: careerProfile }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('career_profiles').select('*').eq('user_id', user.id).maybeSingle()
  ]);

  return jsonResponse({
    user: {
      id: user.id,
      email: user.email,
      profile: profile ?? null,
      career_profile: careerProfile ?? null
    }
  });
}

export async function POST() {
  return unauthorized('Use GET to read the current session.');
}
