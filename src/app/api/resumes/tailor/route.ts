import { badRequest, getAuthedSupabase, jsonResponse, unauthorized } from '@/lib/supabase/route';

export async function POST(request: Request) {
  const { supabase, user } = await getAuthedSupabase();
  if (!user) return unauthorized('Sign in to tailor your resume.');
  const body = await request.json().catch(() => null) as { job_description?: unknown } | null;
  const jobDescription = typeof body?.job_description === 'string' ? body.job_description.trim() : '';
  if (!jobDescription) return badRequest('job_description is required.');
  const { data: profile } = await supabase.from('career_profiles').select('headline, summary, target_roles').eq('user_id', user.id).maybeSingle();
  return jsonResponse({ guidance: `Tailor your ${profile?.headline ?? 'professional'} profile toward the language in this job description. Lead with evidence related to ${profile?.target_roles?.join(', ') ?? 'the target role'}, then add measurable outcomes from your experience.`, source: { profile: Boolean(profile), descriptionLength: jobDescription.length } });
}

export async function GET() { return jsonResponse({ error: 'Use POST with a job_description.' }, { status: 405 }); }
