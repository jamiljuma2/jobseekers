import { dashboardPathForUser, safeNextPath } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const requestedPath = safeNextPath(formData.get('next'), '/dashboard');

  if (!email || !password) {
    const errorUrl = new URL('/auth/login', requestUrl.origin);
    errorUrl.searchParams.set('error', 'Email and password are required.');
    return NextResponse.redirect(errorUrl);
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      const errorUrl = new URL('/auth/login', requestUrl.origin);
      errorUrl.searchParams.set('error', error?.message ?? 'Unable to sign in.');
      return NextResponse.redirect(errorUrl);
    }

    const destination = requestedPath === '/dashboard' ? dashboardPathForUser(data.user) : requestedPath;
    return NextResponse.redirect(new URL(destination, requestUrl.origin));
  } catch (error) {
    const errorUrl = new URL('/auth/login', requestUrl.origin);
    errorUrl.searchParams.set('error', error instanceof Error ? error.message : 'Authentication service is unavailable.');
    return NextResponse.redirect(errorUrl);
  }
}
