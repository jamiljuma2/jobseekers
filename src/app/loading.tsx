export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f8fbf8] px-4 py-5 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading page">
      <div className="mx-auto max-w-[1440px] animate-pulse">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100" />
          <div className="h-5 w-32 rounded-full bg-slate-200" />
          <div className="ml-auto h-9 w-20 rounded-full bg-slate-200" />
        </div>
        <div className="mt-8 border-b border-slate-200/80 pb-8">
          <div className="h-3 w-36 rounded-full bg-emerald-100" />
          <div className="mt-4 h-12 max-w-xl rounded-2xl bg-slate-200" />
          <div className="mt-4 h-5 max-w-2xl rounded-full bg-slate-100" />
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-28 rounded-[1.5rem] border border-slate-100 bg-white" />)}
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="h-80 rounded-[1.75rem] bg-white shadow-[0_8px_20px_rgba(15,23,20,0.04)]" />
          <div className="h-80 rounded-[1.75rem] bg-white shadow-[0_8px_20px_rgba(15,23,20,0.04)]" />
        </div>
      </div>
    </main>
  );
}
