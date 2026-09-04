import { AuthShell } from '@/components/auth-shell';
import { createElement } from 'react';

type LoginPageProps = {
  searchParams?: {
    error?: string;
    message?: string;
    next?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const statusMessage = searchParams?.error ?? searchParams?.message;
  const nextPath = searchParams?.next?.startsWith('/') ? searchParams.next : '/dashboard';

  return createElement(
    AuthShell,
    {
      eyebrow: 'Authentication',
      title: 'Welcome back',
      subtitle: 'Sign in to your Career Passport, review matches, and continue tracking active applications.',
      footerText: 'New here?',
      footerHref: '/auth/register',
      footerLabel: 'Create an account'
    },
    createElement(
      'div',
      { className: 'space-y-4' },
      statusMessage
        ? createElement(
            'div',
            { className: 'rounded-2xl border border-teal/20 bg-teal/10 px-4 py-3 text-sm text-teal-900' },
            statusMessage
          )
        : null,
      createElement(
        'form',
        { action: '/api/auth/login', method: 'post', className: 'space-y-4' },
        createElement('input', { type: 'hidden', name: 'next', value: nextPath }),
        createElement(
          'label',
          { className: 'block space-y-2' },
          createElement('span', { className: 'text-sm font-medium text-slate-700' }, 'Email'),
          createElement('input', {
            type: 'email',
            name: 'email',
            placeholder: 'you@example.com',
            className: 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10'
          })
        ),
        createElement(
          'label',
          { className: 'block space-y-2' },
          createElement('span', { className: 'text-sm font-medium text-slate-700' }, 'Password'),
          createElement('input', {
            type: 'password',
            name: 'password',
            placeholder: 'Enter your password',
            className: 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10'
          })
        ),
        createElement(
          'div',
          { className: 'flex items-center justify-between gap-4 text-sm text-slate-600' },
          createElement(
            'label',
            { className: 'flex items-center gap-2' },
            createElement('input', { type: 'checkbox', className: 'h-4 w-4 rounded border-slate-300 text-teal focus:ring-teal' }),
            'Keep me signed in'
          ),
          createElement(
            'a',
            { href: '/auth/forgot-password', className: 'font-medium text-ink hover:underline' },
            'Forgot password?'
          )
        ),
        createElement(
          'button',
          {
            type: 'submit',
            className: 'w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-900'
          },
          'Sign in'
        )
      ),
      createElement(
        'a',
        {
          href: `/api/auth/google?next=${encodeURIComponent(nextPath)}`,
          className: 'inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-slate-50'
        },
        'Continue with Google'
      )
    )
  );
}
