import { getAuthedSupabase, badRequest, jsonResponse, unauthorized } from '@/lib/supabase/route';

export async function POST(request: Request) {
  const { user } = await getAuthedSupabase();
  if (!user) return unauthorized('Sign in to start a mock interview.');
  const body = await request.json().catch(() => null) as { question?: unknown; answer?: unknown } | null;
  if (typeof body?.question !== 'string' || typeof body?.answer !== 'string' || !body.answer.trim()) return badRequest('question and answer are required.');
  const wordCount = body.answer.trim().split(/\s+/).length;
  return jsonResponse({ score: Math.min(100, 50 + Math.min(wordCount, 50)), feedback: wordCount < 40 ? 'Add more context and a measurable result.' : 'Good detail. Make the outcome and lesson explicit.' });
}

export async function GET() {
  return jsonResponse({ error: 'Use POST to submit a mock interview answer.' }, { status: 405 });
}
