import Link from 'next/link';
import { ProductShell } from '@/components/product-shell';
import { AssistantWorkspace } from '@/components/assistant-workspace';

export default function AssistantPage() {
  return <ProductShell sectionLabel="AI Assistant" title="A thoughtful copilot for every career decision." subtitle="Ask questions about your career, applications, and next steps. Responses use your Career Passport and application history." actions={<Link href="/career-passport" className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.24)]">Update passport</Link>}><AssistantWorkspace /></ProductShell>;
}
