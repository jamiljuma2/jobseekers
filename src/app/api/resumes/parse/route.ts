import { badRequest, getAuthedSupabase, jsonResponse, unauthorized } from '@/lib/supabase/route';

export async function POST(request: Request) {
  const { user } = await getAuthedSupabase();
  if (!user) return unauthorized('Sign in to parse a resume.');
  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File) || !file.size) return badRequest('Attach a PDF or DOCX resume file.');
  const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
  if (!allowed.includes(file.type)) return badRequest('Only PDF and DOCX files are supported.');
  return jsonResponse({ status: 'received', filename: file.name, size: file.size, message: 'Resume received. Review the extracted fields before saving them to your Career Passport.' });
}

export async function GET() { return jsonResponse({ error: 'Use POST with multipart form data.' }, { status: 405 }); }
