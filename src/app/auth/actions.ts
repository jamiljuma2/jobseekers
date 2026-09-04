'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { dashboardPathForUser, safeNextPath } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

function getSiteUrl() {
  const headerList = headers();
  return headerList.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}

function redirectWithQuery(pathname: string, key: string, value: string) {
  const destination = new URL(pathname, getSiteUrl());
  destination.searchParams.set(key, value);
  redirect(destination.toString());
}

export async function signInWithPassword(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const nextPath = safeNextPath(formData.get('next'), '/dashboard');

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirectWithQuery('/auth/login', 'error', error.message);
  }

  redirect(nextPath === '/dashboard' ? dashboardPathForUser((await supabase.auth.getUser()).data.user) : nextPath);
}

export async function signInWithGoogle() {
  const supabase = createSupabaseServerClient();
  const siteUrl = getSiteUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=/dashboard`
    }
  });

  const oauthUrl = data.url;

  if (error || !oauthUrl) {
    redirectWithQuery('/auth/login', 'error', error?.message ?? 'Unable to start Google sign-in.');
  }

  redirect(oauthUrl);
}

export async function signUpWithPassword(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const siteUrl = getSiteUrl();
  const fullName = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const country = String(formData.get('country') ?? '').trim();
  const role = String(formData.get('role') ?? '').trim();
  const nextPath = safeNextPath(formData.get('next'), '/dashboard');

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        country,
        role
      },
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`
    }
  });

  if (error) {
    redirectWithQuery('/auth/register', 'error', error.message);
  }

  if (data.session && data.user) {
    redirect(nextPath === '/dashboard' ? dashboardPathForUser(data.user) : nextPath);
  }

  redirectWithQuery('/auth/login', 'message', 'Check your email to confirm your account.');
}

export async function sendPasswordReset(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const siteUrl = getSiteUrl();
  const email = String(formData.get('email') ?? '').trim();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/auth/update-password`
  });

  if (error) {
    redirectWithQuery('/auth/forgot-password', 'error', error.message);
  }

  redirectWithQuery('/auth/login', 'message', 'Password reset email sent. Check your inbox for the link.');
}

export async function updatePassword(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const password = String(formData.get('password') ?? '');

  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    redirectWithQuery('/auth/update-password', 'error', error.message);
  }

  redirectWithQuery('/auth/login', 'message', 'Password updated. Sign in with your new credentials.');
}
