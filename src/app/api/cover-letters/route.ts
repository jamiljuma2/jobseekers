import { getAuthedSupabase, badRequest, jsonResponse, unauthorized } from '@/lib/supabase/route';

export async function POST(request: Request) {
  const { supabase, user } = await getAuthedSupabase();
  if (!user) return unauthorized('Sign in to create a cover letter.');
  const body = await request.json().catch(() => null) as { job_id?: unknown; job_title?: unknown; company?: unknown } | null;
  const title = typeof body?.job_title === 'string' ? body.job_title.trim() : '';
  if (!title) return badRequest('job_title is required.');
  const { data: profile } = await supabase.from('career_profiles').select('headline, summary').eq('user_id', user.id).maybeSingle();
  return jsonResponse({ content: `Dear hiring team at ${typeof body?.company === 'string' ? body.company : 'the company'},\n\nI am excited to apply for the ${title} role. ${profile?.summary ?? 'My experience and strengths align with the needs of this position.'}\n\nI would welcome the opportunity to discuss how I can contribute.\n\nRegards,\n${profile?.headline ?? 'Candidate'}` });
}

export async function GET() {
  return jsonResponse({ error: 'Use POST to generate a cover letter.' }, { status: 405 });
}
