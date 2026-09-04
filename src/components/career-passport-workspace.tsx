'use client';

import { useState } from 'react';

type CareerPassportWorkspaceProps = {
  initialHeadline: string;
  initialSummary: string;
  initialRoles: string;
  initialLocations: string;
};

export function CareerPassportWorkspace({
  initialHeadline,
  initialSummary,
  initialRoles,
  initialLocations
}: CareerPassportWorkspaceProps) {
  const [editing, setEditing] = useState(false);
  const [headline, setHeadline] = useState(initialHeadline);
  const [summary, setSummary] = useState(initialSummary);
  const [roles, setRoles] = useState(initialRoles);
  const [locations, setLocations] = useState(initialLocations);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    setSaving(true);
    setStatus('');
    setError('');
    try {
      const response = await fetch('/api/career-passport', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline,
          summary,
          target_roles: roles.split(',').map((value) => value.trim()).filter(Boolean),
          target_locations: locations.split(',').map((value) => value.trim()).filter(Boolean),
          profile_completeness: Math.min(100, Math.max(0, [headline, summary, roles, locations].filter((value) => value.trim()).length * 25))
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to save your profile.');
      setEditing(false);
      setStatus('Profile saved. Your job matches will use these updates.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save your profile.');
    } finally {
      setSaving(false);
    }
  }

  async function uploadCv(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    setStatus('');
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/career-passport/upload', { method: 'POST', body: formData });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to upload your CV.');
      setStatus(`${payload.filename} received. Review your profile fields and save them to improve matching.`);
      setFile(null);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload your CV.');
    }
  }

  return (
    <>
      <section className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Improve your match</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Upload your CV to strengthen your Career Passport.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">PDF and DOCX files are accepted. Your signed-in account controls the upload, and you can review profile details before saving them.</p>
          </div>
          <form onSubmit={uploadCv} className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:shrink-0">
            <label className="flex min-w-0 cursor-pointer items-center justify-center rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="truncate">{file?.name ?? 'Choose CV'}</span>
              <input type="file" accept=".pdf,.doc,.docx,application/pdf" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </label>
            <button type="submit" disabled={!file} className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Upload CV</button>
          </form>
        </div>
      </section>

      <section className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,20,0.04)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Profile details</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Keep your professional identity current.</h2></div>
          <button type="button" onClick={() => setEditing((value) => !value)} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm">{editing ? 'Close editor' : 'Edit profile'}</button>
        </div>

        {editing ? <div className="mt-6 grid gap-4"><label className="grid gap-2 text-sm font-medium text-slate-700">Headline<input value={headline} onChange={(event) => setHeadline(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" /></label><label className="grid gap-2 text-sm font-medium text-slate-700">Summary<textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={5} className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium text-slate-700">Target roles<input value={roles} onChange={(event) => setRoles(event.target.value)} placeholder="Product, design, engineering" className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" /></label><label className="grid gap-2 text-sm font-medium text-slate-700">Target locations<input value={locations} onChange={(event) => setLocations(event.target.value)} placeholder="Nairobi, Remote" className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" /></label></div><button type="button" onClick={() => void saveProfile()} disabled={saving} className="w-fit rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save profile'}</button></div> : <div className="mt-6 grid gap-5 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Headline</p><p className="mt-2 text-sm text-slate-700">{headline || 'Add a professional headline'}</p></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Target roles</p><p className="mt-2 text-sm text-slate-700">{roles || 'No target roles added yet'}</p></div><div className="sm:col-span-2"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Summary</p><p className="mt-2 text-sm leading-7 text-slate-700">{summary || 'Add a summary to improve match explanations.'}</p></div></div>}
        {status ? <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{status}</p> : null}
        {error ? <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      </section>
    </>
  );
}
