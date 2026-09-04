import { badRequest, getAuthedSupabase, jsonResponse, unauthorized } from '@/lib/supabase/route';

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
  const reason = String(payload.reason ?? '').trim();

  if (!jobId || !reason) {
    return badRequest('job_id and reason are required.');
  }

  const { data, error } = await supabase.from('job_reports').insert({
    user_id: user.id,
    job_id: jobId,
    reason,
    details: typeof payload.details === 'string' ? payload.details : null
  }).select('*').maybeSingle();

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  return jsonResponse({ report: data });
}

export async function GET() {
  return jsonResponse({ error: 'Use POST to create a report.' }, { status: 405 });
}
