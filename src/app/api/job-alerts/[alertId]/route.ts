import { badRequest, getAuthedSupabase, jsonResponse, notFound, unauthorized } from '@/lib/supabase/route';

type Params = {
  params: Promise<{
    alertId: string;
  }>;
};

export async function PATCH(_request: Request, { params }: Params) {
  const { alertId } = await params;
  const { supabase, user } = await getAuthedSupabase();

  if (!user) {
    return unauthorized('No active session found.');
  }

  const body = await _request.json().catch(() => null);

  if (!body || typeof body !== 'object') {
    return badRequest('Expected a JSON payload.');
  }

  const payload = body as Record<string, unknown>;
  const updates: Record<string, unknown> = {};

  ['keywords', 'location', 'work_type', 'salary_min', 'remote_only', 'channels', 'is_active'].forEach((field) => {
    if (field in payload) {
      updates[field] = payload[field];
    }
  });

  const { data, error } = await supabase.from('job_alerts').update(updates).eq('id', alertId).eq('user_id', user.id).select('*').maybeSingle();

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  if (!data) {
    return notFound('Job alert not found.');
  }

  return jsonResponse({ alert: data });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { alertId } = await params;
  const { supabase, user } = await getAuthedSupabase();

  if (!user) {
    return unauthorized('No active session found.');
  }

  const { data, error } = await supabase.from('job_alerts').delete().eq('id', alertId).eq('user_id', user.id).select('*').maybeSingle();

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  if (!data) {
    return notFound('Job alert not found.');
  }

  return jsonResponse({ alert: data });
}

export async function GET() {
  return jsonResponse({ error: 'Use PATCH or DELETE on this resource.' }, { status: 405 });
}
