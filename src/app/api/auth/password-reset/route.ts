import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const supabase = createSupabaseServerClient();
  const email = String(formData.get('email') ?? '').trim();

  if (!email) {
    const redirectUrl = new URL('/auth/forgot-password', requestUrl.origin);
    redirectUrl.searchParams.set('error', 'Email is required.');
    return NextResponse.redirect(redirectUrl);
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: new URL('/auth/callback?next=/auth/update-password', requestUrl.origin).toString()
  });

  if (error) {
    const redirectUrl = new URL('/auth/forgot-password', requestUrl.origin);
    redirectUrl.searchParams.set('error', error.message);
    return NextResponse.redirect(redirectUrl);
  }

  const loginUrl = new URL('/auth/login', requestUrl.origin);
  loginUrl.searchParams.set('message', 'Password reset email sent. Check your inbox for the link.');
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: Request) {
  return NextResponse.redirect(new URL('/auth/forgot-password', request.url));
}
