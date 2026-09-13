import Link from "next/link";
import { MailCheck } from "lucide-react";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-5 z-40 flex justify-center px-4">
      <nav
        className="glass-light flex w-[94%] max-w-5xl items-center justify-between rounded-full py-2 pl-5 pr-2 sm:w-[80%] sm:pl-6 sm:pr-3"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex items-center gap-3" aria-label="MailGuard home">
          <span className="grid size-9 place-items-center rounded-full bg-[#0071e3]/10 text-[#0071e3]">
            <MailCheck size={18} aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight text-[#1d1d1f] sm:text-base">MailGuard</span>
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6e6e73] sm:block">Email security system</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-xs font-medium text-[#6e6e73] transition hover:text-[#1d1d1f]">Overview</Link>
          <Link href="/login" className="text-xs font-medium text-[#6e6e73] transition hover:text-[#1d1d1f]">Sign in</Link>
        </div>

        <Link href="/register" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#333]">Get started</Link>
      </nav>
    </header>
  );
}
