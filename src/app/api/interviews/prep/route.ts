import { badRequest, getAuthedSupabase, jsonResponse, unauthorized } from '@/lib/supabase/route';

export async function POST(request: Request) {
  const { supabase, user } = await getAuthedSupabase();
  if (!user) return unauthorized('Sign in to practice interview questions.');
  const body = await request.json().catch(() => null) as { question?: unknown; answer?: unknown } | null;
  const question = typeof body?.question === 'string' ? body.question.trim() : '';
  const answer = typeof body?.answer === 'string' ? body.answer.trim() : '';
  if (!question) return badRequest('Choose an interview question first.');
  if (!answer) return badRequest('Write an answer before requesting feedback.');

  const { data: profile } = await supabase.from('career_profiles').select('target_roles, headline').eq('user_id', user.id).maybeSingle();
  const words = answer.split(/\s+/).filter(Boolean).length;
  const hasResultSignal = /result|increased|reduced|improved|delivered|saved|grew|percent|%/i.test(answer);
  const feedback = [
    words < 45 ? 'Add more context so the interviewer can understand the situation and your responsibility.' : 'Your answer has enough detail to follow.',
    hasResultSignal ? 'Good use of an outcome or measurable signal.' : 'Close with a measurable result or clear lesson learned.',
    `Keep the answer tied to ${profile?.target_roles?.[0] ?? profile?.headline ?? 'the role you are targeting'}.`
  ];

  return jsonResponse({ score: Math.min(95, Math.max(45, 55 + (words >= 45 ? 15 : 0) + (hasResultSignal ? 20 : 0))), feedback });
}
