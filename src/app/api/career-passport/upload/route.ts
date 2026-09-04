import { badRequest, getAuthedSupabase, jsonResponse, unauthorized } from '@/lib/supabase/route';

export async function POST(request: Request) {
  const { user } = await getAuthedSupabase();
  if (!user) return unauthorized('Sign in to upload a Career Passport document.');
  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File) || !file.size) return badRequest('Attach a PDF or DOCX file.');
  if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(file.type)) return badRequest('Only PDF and DOCX files are supported.');
  return jsonResponse({ status: 'received', filename: file.name, message: 'Document received for Career Passport review.' });
}

export async function GET() { return jsonResponse({ error: 'Use POST with multipart form data.' }, { status: 405 }); }
