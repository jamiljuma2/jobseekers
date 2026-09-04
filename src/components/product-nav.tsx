'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  label: string;
  href: string;
};

type ProductNavProps = {
  items: NavItem[];
};

export function ProductNav({ items }: ProductNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="order-3 flex basis-full items-center gap-1 overflow-x-auto pb-1 lg:order-none lg:basis-auto lg:overflow-visible lg:pb-0">
      {items.map((item) => {
        const isActive = item.href === '/'
          ? pathname === '/'
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
              isActive
                ? 'bg-emerald-100 text-emerald-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(16,185,129,0.12)]'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
