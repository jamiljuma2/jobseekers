import type { User } from '@supabase/supabase-js';

export function isAdminUser(user: User | null) {
  if (!user) {
    return false;
  }

  if (user.app_metadata?.role === 'admin') {
    return true;
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(user.email && adminEmails.includes(user.email.toLowerCase()));
}

export function dashboardPathForUser(user: User | null) {
  return isAdminUser(user) ? '/admin/dashboard' : '/dashboard';
}

export function safeNextPath(value: FormDataEntryValue | string | null, fallback: string) {
  const candidate = typeof value === 'string' ? value : '';
  return candidate.startsWith('/') && !candidate.startsWith('//') ? candidate : fallback;
}
