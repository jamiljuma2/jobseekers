import Link from 'next/link';
import { ProductShell } from '@/components/product-shell';
import { InterviewWorkspace } from '@/components/interview-workspace';

export default function InterviewPrepPage() {
  return <ProductShell sectionLabel="Interview Prep" title="Walk into every interview prepared." subtitle="Practice common questions, structure stronger STAR answers, and get actionable feedback before the real conversation." actions={<Link href="/assistant" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm">Ask AI coach</Link>}><InterviewWorkspace /></ProductShell>;
}
