'use client';

import { useState } from 'react';

const questions = ['Tell me about yourself', 'Project ownership and delivery', 'Why should we hire you?'];

export function InterviewWorkspace() {
  const [question, setQuestion] = useState(questions[0]);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function practice() {
    if (!answer.trim() || loading) return;
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/interviews/prep', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, answer }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to review this answer.');
      setScore(payload.score); setFeedback(payload.feedback ?? []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to review this answer.');
    } finally { setLoading(false); }
  }

  return <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_8px_20px_rgba(15,23,20,0.04)]"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Practice room</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Answer, then get practical feedback.</h2><div className="mt-6 space-y-3">{questions.map((item) => <button key={item} onClick={() => { setQuestion(item); setFeedback([]); setScore(null); }} className={`w-full rounded-[1.25rem] border p-4 text-left transition ${question === item ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-200'}`}><p className="text-sm font-semibold text-slate-950">{item}</p><p className="mt-1 text-xs text-slate-500">Behavioral practice question</p></button>)}</div><label className="mt-6 block"><span className="text-sm font-semibold text-slate-700">Your answer</span><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={7} placeholder="Use Situation, Task, Action, and Result..." className="mt-2 w-full rounded-[1.25rem] border border-slate-200 px-4 py-3 text-sm leading-7 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" /></label><button onClick={() => void practice()} disabled={loading || !answer.trim()} className="mt-4 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Reviewing...' : 'Get feedback'}</button>{error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}{score !== null ? <div className="mt-6 rounded-[1.25rem] bg-emerald-50 p-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Answer score</p><p className="text-2xl font-semibold text-emerald-700">{score}%</p></div><ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">{feedback.map((item) => <li key={item}>• {item}</li>)}</ul></div> : null}</section>
    <aside className="rounded-[1.75rem] bg-emerald-950 p-6 text-white shadow-[0_12px_35px_rgba(6,78,59,0.28)]"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">STAR framework</p><h2 className="mt-3 text-2xl font-semibold tracking-tight">Make every answer easy to follow.</h2><div className="mt-6 space-y-4">{[['Situation', 'Set the context.'], ['Task', 'Clarify your responsibility.'], ['Action', 'Explain your decisions.'], ['Result', 'Close with an outcome or lesson.']].map(([label, text], index) => <div key={label} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-emerald-300">{index + 1}</span><div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-sm text-white/65">{text}</p></div></div>)}</div></aside>
  </div>;
}
