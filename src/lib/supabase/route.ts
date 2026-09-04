import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from './server';

export async function getAuthedSupabase() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  return {
    supabase,
    user: data.user ?? null,
    error
  };
}

export function jsonResponse(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function unauthorized(message = 'Unauthorized') {
  return jsonResponse({ error: message }, { status: 401 });
}

export function badRequest(message = 'Bad request') {
  return jsonResponse({ error: message }, { status: 400 });
}

export function notFound(message = 'Not found') {
  return jsonResponse({ error: message }, { status: 404 });
}
