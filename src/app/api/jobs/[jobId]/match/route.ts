import { calculateJobMatch } from '@/lib/job-match';
import { getAuthedSupabase, jsonResponse, notFound } from '@/lib/supabase/route';

type Params = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { jobId } = await params;
  const { supabase, user } = await getAuthedSupabase();

  const { data: job, error } = await supabase.from('jobs').select('*').eq('id', jobId).maybeSingle();

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  if (!job) {
    return notFound('Job not found.');
  }

  if (!user) {
    return jsonResponse({ job_id: jobId, match: null, message: 'Sign in to see your profile match score.' });
  }

  const [{ data: careerProfile }, { data: experiences }, { data: education }, { data: skills }, { data: certifications }, { data: projects }] = await Promise.all([
    supabase.from('career_profiles').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('experiences').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
    supabase.from('education').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
    supabase.from('skills').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
    supabase.from('certifications').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
    supabase.from('projects').select('*').eq('user_id', user.id).order('sort_order', { ascending: true })
  ]);

  const profile = {
    ...(careerProfile ?? {}),
    experiences: experiences ?? [],
    education: education ?? [],
    skills: skills ?? [],
    certifications: certifications ?? [],
    projects: projects ?? []
  };

  return jsonResponse({
    job_id: jobId,
    match: calculateJobMatch(profile, job)
  });
}

export async function POST() {
  return jsonResponse({ error: 'Use GET for job match details.' }, { status: 405 });
}
