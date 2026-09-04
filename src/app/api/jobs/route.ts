import { calculateJobMatch } from '@/lib/job-match';
import { getAuthedSupabase, jsonResponse } from '@/lib/supabase/route';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const keyword = requestUrl.searchParams.get('keyword')?.trim().toLowerCase() ?? '';
  const location = requestUrl.searchParams.get('location')?.trim().toLowerCase() ?? '';
  const remote = requestUrl.searchParams.get('remote')?.trim().toLowerCase() ?? '';
  const industry = requestUrl.searchParams.get('industry')?.trim().toLowerCase() ?? '';
  const employmentType = requestUrl.searchParams.get('employmentType')?.trim().toLowerCase() ?? '';
  const limit = Number(requestUrl.searchParams.get('limit') ?? 20);

  const { supabase, user } = await getAuthedSupabase();
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, title, location, remote_type, employment_type, industry, salary_min, salary_max, currency, description, requirements, responsibilities, external_url, is_verified, scam_flag_score, published_at, employer_id, employers(id, name, verification_status)')
    .order('published_at', { ascending: false })
    .limit(Number.isFinite(limit) ? limit : 20);

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  let filteredJobs = (jobs ?? []).filter((job) => {
    const searchBlob = [job.title, job.location, job.remote_type, job.employment_type, job.industry, job.description, job.requirements, job.responsibilities]
      .map((value) => String(value ?? '').toLowerCase())
      .join(' ');

    const keywordMatches = keyword ? keyword.split(/\s+/).filter(Boolean).every((term) => searchBlob.includes(term)) : true;
    const locationMatches = location ? searchBlob.includes(location) : true;
    const remoteMatches = remote ? searchBlob.includes(remote) : true;
    const industryMatches = industry ? searchBlob.includes(industry) : true;
    const employmentMatches = employmentType ? searchBlob.includes(employmentType) : true;

    return keywordMatches && locationMatches && remoteMatches && industryMatches && employmentMatches;
  });

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

    filteredJobs = filteredJobs.map((job) => ({
      ...job,
      saved: false,
      application_status: null,
      match: calculateJobMatch(profile, job)
    }));
  } else {
    filteredJobs = filteredJobs.map((job) => ({
      ...job,
      saved: false,
      application_status: null,
      match: null
    }));
  }

  return jsonResponse({ jobs: filteredJobs });
}
