import { badRequest, getAuthedSupabase, jsonResponse, notFound, unauthorized } from '@/lib/supabase/route';

export async function GET() {
  const { supabase, user } = await getAuthedSupabase();

  if (!user) {
    return unauthorized('No active session found.');
  }

  const { data: applications, error } = await supabase.from('applications').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  const jobIds = Array.from(new Set((applications ?? []).map((application) => application.job_id)));
  const resumeIds = Array.from(new Set((applications ?? []).map((application) => application.resume_id).filter(Boolean) as string[]));
  const coverLetterIds = Array.from(new Set((applications ?? []).map((application) => application.cover_letter_id).filter(Boolean) as string[]));

  const [{ data: jobs }, { data: resumes }, { data: coverLetters }] = await Promise.all([
    jobIds.length ? supabase.from('jobs').select('id, title, location, remote_type, employment_type, industry, external_url, is_verified, employers(id, name, verification_status)').in('id', jobIds) : Promise.resolve({ data: [] }),
    resumeIds.length ? supabase.from('resumes').select('id, label, file_url, file_type, is_primary').in('id', resumeIds) : Promise.resolve({ data: [] }),
    coverLetterIds.length ? supabase.from('cover_letters').select('id, tone, content, job_id, resume_id').in('id', coverLetterIds) : Promise.resolve({ data: [] })
  ]);

  const jobsById = new Map((jobs ?? []).map((job) => [job.id, job]));
  const resumesById = new Map((resumes ?? []).map((resume) => [resume.id, resume]));
  const coverLettersById = new Map((coverLetters ?? []).map((coverLetter) => [coverLetter.id, coverLetter]));

  return jsonResponse({
    applications: (applications ?? []).map((application) => ({
      ...application,
      job: jobsById.get(application.job_id) ?? null,
      resume: application.resume_id ? resumesById.get(application.resume_id) ?? null : null,
      cover_letter: application.cover_letter_id ? coverLettersById.get(application.cover_letter_id) ?? null : null
    }))
  });
}

export async function POST(request: Request) {
  const { supabase, user } = await getAuthedSupabase();

  if (!user) {
    return unauthorized('No active session found.');
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== 'object') {
    return badRequest('Expected a JSON payload.');
  }

  const payload = body as Record<string, unknown>;
  const jobId = String(payload.job_id ?? payload.jobId ?? '').trim();

  if (!jobId) {
    return badRequest('job_id is required.');
  }

  const { data: job } = await supabase.from('jobs').select('id').eq('id', jobId).maybeSingle();

  if (!job) {
    return notFound('Job not found.');
  }

  const existingApplication = await supabase.from('applications').select('id').eq('user_id', user.id).eq('job_id', jobId).maybeSingle();

  const nextApplication = {
    user_id: user.id,
    job_id: jobId,
    resume_id: payload.resume_id ? String(payload.resume_id) : null,
    cover_letter_id: payload.cover_letter_id ? String(payload.cover_letter_id) : null,
    status: typeof payload.status === 'string' ? payload.status : 'saved',
    notes: typeof payload.notes === 'string' ? payload.notes : null,
    contact_person_name: typeof payload.contact_person_name === 'string' ? payload.contact_person_name : null,
    contact_person_email: typeof payload.contact_person_email === 'string' ? payload.contact_person_email : null,
    interview_at: typeof payload.interview_at === 'string' ? payload.interview_at : null,
    follow_up_at: typeof payload.follow_up_at === 'string' ? payload.follow_up_at : null,
    applied_at: typeof payload.applied_at === 'string' ? payload.applied_at : null
  };

  const { data, error } = existingApplication.data
    ? await supabase.from('applications').update(nextApplication).eq('id', existingApplication.data.id).select('*').maybeSingle()
    : await supabase.from('applications').insert(nextApplication).select('*').maybeSingle();

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  return jsonResponse({ application: data });
}

export async function PATCH() {
  return jsonResponse({ error: 'Use PATCH on /api/applications/[applicationId].' }, { status: 405 });
}
