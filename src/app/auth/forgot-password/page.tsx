import { AuthShell } from '@/components/auth-shell';
import { sendPasswordReset } from '../actions';

type ForgotPasswordPageProps = {
  searchParams?: {
    error?: string;
    message?: string;
  };
};

export default function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const statusMessage = searchParams?.error ?? searchParams?.message;

  return (
    <AuthShell
      eyebrow="Authentication"
      title="Reset your password"
      subtitle="We will send a reset link to the email address on your account so you can get back into your search quickly."
      footerText="Remember your password?"
      footerHref="/auth/login"
      footerLabel="Return to sign in"
    >
      <div className="space-y-4">
        {statusMessage ? (
          <div className="rounded-2xl border border-teal/20 bg-teal/10 px-4 py-3 text-sm text-teal-900">
            {statusMessage}
          </div>
        ) : null}

        <form action={sendPasswordReset} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-900"
          >
            Send reset link
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
