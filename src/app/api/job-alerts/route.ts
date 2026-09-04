import { badRequest, getAuthedSupabase, jsonResponse, unauthorized } from '@/lib/supabase/route';

export async function GET() {
  const { supabase, user } = await getAuthedSupabase();

  if (!user) {
    return unauthorized('No active session found.');
  }

  const { data, error } = await supabase.from('job_alerts').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  return jsonResponse({ alerts: data ?? [] });
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

  const { data, error } = await supabase.from('job_alerts').insert({
    user_id: user.id,
    keywords: typeof payload.keywords === 'string' ? payload.keywords : null,
    location: typeof payload.location === 'string' ? payload.location : null,
    work_type: typeof payload.work_type === 'string' ? payload.work_type : null,
    salary_min: typeof payload.salary_min === 'number' ? payload.salary_min : null,
    remote_only: payload.remote_only === true,
    channels: Array.isArray(payload.channels) ? payload.channels.map(String) : ['in_app', 'email'],
    is_active: payload.is_active !== false
  }).select('*').maybeSingle();

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  return jsonResponse({ alert: data });
}

export async function PATCH() {
  return jsonResponse({ error: 'Use PATCH on /api/job-alerts/[alertId].' }, { status: 405 });
}
