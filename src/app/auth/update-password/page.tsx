import { AuthShell } from '@/components/auth-shell';
import { updatePassword } from '../actions';

type UpdatePasswordPageProps = {
  searchParams?: {
    error?: string;
    message?: string;
    next?: string;
  };
};

export default function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
  const statusMessage = searchParams?.error ?? searchParams?.message;
  const nextPath = searchParams?.next?.startsWith('/') ? searchParams.next : '/dashboard';

  return (
    <AuthShell
      eyebrow="Authentication"
      title="Set a new password"
      subtitle="Finish your reset flow by choosing a new password for your Career Scout account."
      footerText="Need to sign in instead?"
      footerHref="/auth/login"
      footerLabel="Return to login"
    >
      <div className="space-y-4">
        {statusMessage ? (
          <div className="rounded-2xl border border-teal/20 bg-teal/10 px-4 py-3 text-sm text-teal-900">
            {statusMessage}
          </div>
        ) : null}

        <form action={updatePassword} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">New password</span>
            <input
              type="password"
              name="password"
              placeholder="Create a strong new password"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-900"
          >
            Update password
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
