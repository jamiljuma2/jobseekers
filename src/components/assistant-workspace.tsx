'use client';

import { useState } from 'react';

const prompts = ['Improve my CV summary', 'Find my best-fit roles', 'Plan my next application'];

export function AssistantWorkspace() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function ask(nextPrompt = prompt) {
    const value = nextPrompt.trim();
    if (!value || loading) return;
    setPrompt(value);
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: value }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to get career guidance.');
      setAnswer(payload.answer);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to get career guidance.');
    } finally {
      setLoading(false);
    }
  }

  return <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(15,23,20,0.04)]">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Career conversation</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">What would you like to work on?</h2>
      <div className="mt-6 rounded-[1.5rem] bg-emerald-950 p-6 text-white"><p className="text-sm font-semibold text-emerald-300">Career Scout AI</p><p className="mt-3 text-lg leading-8 text-white/85">Ask a question and receive guidance grounded in your Career Passport and application history.</p></div>
      <div className="mt-6 grid gap-3">{prompts.map((item) => <button key={item} onClick={() => ask(item)} disabled={loading} className="rounded-[1.25rem] border border-slate-200 bg-[#fbfdfb] p-4 text-left transition hover:border-emerald-200 hover:shadow-sm disabled:opacity-60"><p className="text-sm font-semibold text-slate-950">{item}</p><p className="mt-1 text-sm text-slate-600">Use your profile context to make this next step specific.</p></button>)}</div>
      <form className="mt-6 flex gap-3" onSubmit={(event) => { event.preventDefault(); void ask(); }}><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask Career Scout anything..." className="min-w-0 flex-1 rounded-full border border-slate-200 px-5 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" /><button disabled={loading || !prompt.trim()} className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Thinking...' : 'Ask AI'}</button></form>
      {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {answer ? <div className="mt-6 rounded-[1.25rem] border border-emerald-100 bg-emerald-50 p-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Career Scout response</p><p className="mt-3 text-sm leading-7 text-slate-700">{answer}</p></div> : null}
    </section>
    <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(15,23,20,0.04)]"><h2 className="text-lg font-semibold text-slate-950">Your coaching context</h2><p className="mt-3 text-sm leading-7 text-slate-600">Responses use your signed-in profile and application records. Add more detail to your Career Passport for more relevant guidance.</p><a href="/career-passport" className="mt-6 inline-flex text-sm font-semibold text-emerald-600">Complete your context →</a></aside>
  </div>;
}
