import { AuthShell } from '@/components/auth-shell';
import { signInWithGoogle, signUpWithPassword } from '../actions';

type RegisterPageProps = {
  searchParams?: {
    error?: string;
    message?: string;
    next?: string;
  };
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const statusMessage = searchParams?.error ?? searchParams?.message;
  const nextPath = searchParams?.next?.startsWith('/') ? searchParams.next : '/dashboard';

  return (
    <AuthShell
      eyebrow="Authentication"
      title="Create your Career Passport"
      subtitle="Set up your profile once, then reuse it across tailored applications, alerts, and interview preparation."
      footerText="Already have an account?"
      footerHref="/auth/login"
      footerLabel="Sign in"
    >
      <div className="space-y-4">
        {statusMessage ? (
          <div className="rounded-2xl border border-teal/20 bg-teal/10 px-4 py-3 text-sm text-teal-900">
            {statusMessage}
          </div>
        ) : null}

        <form action={signUpWithPassword} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Full name</span>
            <input
              type="text"
              name="name"
              placeholder="Jamil Juma"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Country</span>
              <input
                type="text"
                name="country"
                placeholder="Kenya"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create a secure password"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Primary role</span>
            <input
              type="text"
              name="role"
              placeholder="Operations, design, product, software..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-900"
          >
            Create account
          </button>

          <button
            type="submit"
            formAction={signInWithGoogle}
            className="w-full rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
