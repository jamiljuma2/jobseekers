import { badRequest, getAuthedSupabase, jsonResponse, notFound, unauthorized } from '@/lib/supabase/route';

type Params = {
  params: Promise<{
    applicationId: string;
  }>;
};

export async function PATCH(_request: Request, { params }: Params) {
  const { applicationId } = await params;
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

  ['status', 'notes', 'contact_person_name', 'contact_person_email', 'interview_at', 'follow_up_at', 'resume_id', 'cover_letter_id'].forEach((field) => {
    if (field in payload) {
      updates[field] = payload[field];
    }
  });

  const { data, error } = await supabase.from('applications').update(updates).eq('id', applicationId).eq('user_id', user.id).select('*').maybeSingle();

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  if (!data) {
    return notFound('Application not found.');
  }

  return jsonResponse({ application: data });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { applicationId } = await params;
  const { supabase, user } = await getAuthedSupabase();

  if (!user) {
    return unauthorized('No active session found.');
  }

  const { data, error } = await supabase.from('applications').update({ status: 'withdrawn' }).eq('id', applicationId).eq('user_id', user.id).select('*').maybeSingle();

  if (error) {
    return jsonResponse({ error: error.message }, { status: 400 });
  }

  if (!data) {
    return notFound('Application not found.');
  }

  return jsonResponse({ application: data });
}

export async function GET() {
  return jsonResponse({ error: 'Use PATCH or DELETE on this resource.' }, { status: 405 });
}
