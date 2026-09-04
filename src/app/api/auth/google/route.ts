import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

function safeNextPath(value: string | null) {
  return value && value.startsWith('/') ? value : '/dashboard';
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const nextPath = safeNextPath(requestUrl.searchParams.get('next'));
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: new URL(`/auth/callback?next=${encodeURIComponent(nextPath)}`, requestUrl.origin).toString()
    }
  });

  const oauthUrl = data.url;

  if (error || !oauthUrl) {
    const loginUrl = new URL('/auth/login', requestUrl.origin);
    loginUrl.searchParams.set('error', error?.message ?? 'Unable to start Google sign-in.');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(oauthUrl);
}
