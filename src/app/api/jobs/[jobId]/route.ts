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

  const { data: job, error } = await supabase
    .from('jobs')
    .select('id, title, location, remote_type, employment_type, industry, salary_min, salary_max, currency, description, requirements, responsibilities, external_url, is_verified, scam_flag_score, published_at, employer_id, employers(id, name, website, country, verification_status)')
    .eq('id', jobId)
    .maybeSingle();

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  if (!job) {
    return notFound('Job not found.');
  }

  let match = null;

  if (user) {
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

    match = calculateJobMatch(profile, job);
  }

  return jsonResponse({
    job,
    saved: false,
    application_status: null,
    match
  });
}

export async function PATCH() {
  return jsonResponse({ error: 'Use GET for job details.' }, { status: 405 });
}

export async function DELETE() {
  return jsonResponse({ error: 'Use GET for job details.' }, { status: 405 });
}
