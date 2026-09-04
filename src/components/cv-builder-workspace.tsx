'use client';

import { useState } from 'react';

type CvBuilderWorkspaceProps = {
  initialName: string;
  initialHeadline: string;
  initialSummary: string;
  initialRoles: string;
};

export function CvBuilderWorkspace({ initialName, initialHeadline, initialSummary, initialRoles }: CvBuilderWorkspaceProps) {
  const [name, setName] = useState(initialName);
  const [headline, setHeadline] = useState(initialHeadline);
  const [summary, setSummary] = useState(initialSummary);
  const [roles, setRoles] = useState(initialRoles);
  const [jobDescription, setJobDescription] = useState('');
  const [tailoring, setTailoring] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function saveToPassport() {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/career-passport', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name,
          headline,
          summary,
          target_roles: roles.split(',').map((role) => role.trim()).filter(Boolean),
          profile_completeness: Math.min(100, [name, headline, summary, roles].filter((value) => value.trim()).length * 25)
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to save your CV profile.');
      setMessage('Saved to your Career Passport. New job matches will use this version.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save your CV profile.');
    } finally {
      setSaving(false);
    }
  }

  async function tailorForRole() {
    if (!jobDescription.trim()) return;
    setTailoring(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/resumes/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to tailor this CV.');
      setSummary((current) => `${current}${current ? '\n\n' : ''}${payload.guidance}`);
      setMessage('Tailoring guidance added to your summary. Review it before saving.');
    } catch (tailorError) {
      setError(tailorError instanceof Error ? tailorError.message : 'Unable to tailor this CV.');
    } finally {
      setTailoring(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,20,0.04)] sm:p-6">
        <div className="flex flex-col gap-2"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">CV editor</p><h2 className="text-2xl font-semibold tracking-tight text-slate-950">Build a clear, targeted CV.</h2><p className="text-sm leading-7 text-slate-600">Edit the content on the left and review the result live on the right.</p></div>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">Full name<input value={name} onChange={(event) => setName(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" /></label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Professional headline<input value={headline} onChange={(event) => setHeadline(event.target.value)} placeholder="Product Operations Specialist" className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" /></label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Professional summary<textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={7} placeholder="Describe your strengths, experience, and the value you bring..." className="rounded-xl border border-slate-200 px-4 py-3 font-normal leading-7 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" /></label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Target roles <span className="font-normal text-slate-500">Separate roles with commas</span><input value={roles} onChange={(event) => setRoles(event.target.value)} placeholder="Operations, Product, Customer Success" className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" /></label>
        </div>
        <div className="mt-6 border-t border-slate-100 pt-6"><p className="text-sm font-semibold text-slate-950">Tailor this CV to a role</p><p className="mt-1 text-sm leading-6 text-slate-600">Paste a job description and receive focused guidance for your summary.</p><textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} rows={5} placeholder="Paste the job description here..." className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" /><button type="button" onClick={() => void tailorForRole()} disabled={tailoring || !jobDescription.trim()} className="mt-3 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">{tailoring ? 'Tailoring...' : 'Tailor for this role'}</button></div>
        <button type="button" onClick={() => void saveToPassport()} disabled={saving} className="mt-6 w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save to Career Passport'}</button>
        {message ? <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p> : null}
        {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      </section>

      <aside className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,20,0.04)] sm:p-8"><div className="border-b border-slate-200 pb-5"><p className="text-2xl font-bold tracking-tight text-slate-950">{name || 'Your Name'}</p><p className="mt-1 text-sm font-semibold text-emerald-700">{headline || 'Professional headline'}</p><p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{summary || 'Your professional summary will appear here as you write it.'}</p></div><div className="pt-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Target roles</p><p className="mt-2 break-words text-sm text-slate-700">{roles || 'Add target roles to focus your applications.'}</p></div><div className="mt-8 border-t border-dashed border-slate-200 pt-5"><p className="text-xs leading-6 text-slate-500">This preview reflects the profile content currently in the editor. Save it to use the same information for job matching and applications.</p></div></aside>
    </div>
  );
}
