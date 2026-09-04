import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

function safeNextPath(value: string | null) {
  return value && value.startsWith('/') ? value : '/dashboard';
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const supabase = createSupabaseServerClient();
  const nextPath = safeNextPath(String(formData.get('next') ?? null));
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const fullName = String(formData.get('name') ?? '').trim();
  const country = String(formData.get('country') ?? '').trim();
  const role = String(formData.get('role') ?? '').trim();

  if (!email || !password) {
    const loginUrl = new URL('/auth/register', requestUrl.origin);
    loginUrl.searchParams.set('error', 'Email and password are required.');
    return NextResponse.redirect(loginUrl);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        country,
        role
      },
      emailRedirectTo: new URL(`/auth/callback?next=${encodeURIComponent(nextPath)}`, requestUrl.origin).toString()
    }
  });

  if (error) {
    const loginUrl = new URL('/auth/register', requestUrl.origin);
    loginUrl.searchParams.set('error', error.message);
    return NextResponse.redirect(loginUrl);
  }

  if (data.session) {
    return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
  }

  const loginUrl = new URL('/auth/login', requestUrl.origin);
  loginUrl.searchParams.set('message', 'Check your email to confirm your account.');
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: Request) {
  return NextResponse.redirect(new URL('/auth/register', request.url));
}
