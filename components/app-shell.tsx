"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarChart3, Database, Gauge, History, LayoutDashboard, LogOut, MailCheck, MessageSquare, ScanSearch, Settings, Users } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const userLinks = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/classify", "Classify email", ScanSearch],
  ["/history", "My history", History],
  ["/feedback", "Feedback", MessageSquare],
  ["/profile", "Profile", Settings],
] as const;

const adminLinks = [
  ["/admin", "Overview", Gauge],
  ["/admin/users", "Users", Users],
  ["/admin/logs", "Logs", History],
  ["/admin/feedback", "Feedback", MessageSquare],
  ["/admin/model", "Model & data", Database],
  ["/admin/analytics", "Analytics", BarChart3],
] as const;

export function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    else if (!loading && admin && user?.role !== "admin") router.replace("/dashboard");
  }, [admin, loading, router, user]);

  if (loading || !user || (admin && user.role !== "admin")) {
    return <div className="page-wash grid min-h-screen place-items-center text-sm text-[#6e6e73]">Loading secure workspace…</div>;
  }

  const links = admin ? adminLinks : userLinks;
  return (
    <main className="page-wash min-h-screen">
      <header className="fixed inset-x-0 top-5 z-40 flex justify-center px-4">
        <nav className="glass-light flex w-[94%] max-w-6xl items-center justify-between rounded-full py-2 pl-5 pr-2 sm:w-[80%] sm:pl-6 sm:pr-3">
          <Link href={admin ? "/admin" : "/dashboard"} className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-[#0071e3]/10 text-[#0071e3]"><MailCheck size={18} /></span>
            <span className="leading-tight"><b className="block text-sm text-[#1d1d1f]">MailGuard</b><small className="hidden uppercase tracking-[0.15em] text-[#6e6e73] sm:block">{admin ? "Admin console" : "Email security system"}</small></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block"><b className="block text-xs text-[#1d1d1f]">{user.full_name}</b><small className="capitalize text-[#6e6e73]">{user.role}</small></span>
            <button onClick={logout} aria-label="Log out" className="grid size-10 place-items-center rounded-full border border-black/10 bg-white/70 text-[#1d1d1f] transition hover:bg-white"><LogOut size={17} /></button>
          </div>
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 pb-12 pt-28 lg:grid-cols-[230px_1fr]">
        <aside className="glass-light h-fit overflow-x-auto rounded-[28px] p-3">
          <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6e6e73]">{admin ? "Administration" : "Workspace"}</p>
          <div className="flex min-w-max gap-1 lg:block lg:min-w-0">
            {links.map(([href, label, Icon]) => (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition lg:my-1 ${pathname === href ? "bg-[#1d1d1f] text-white" : "text-[#6e6e73] hover:bg-white/80 hover:text-[#1d1d1f]"}`}>
                <Icon size={17} />{label}
              </Link>
            ))}
          </div>
          {user.role === "admin" && (
            <Link href={admin ? "/dashboard" : "/admin"} className="mt-3 flex items-center gap-3 border-t border-black/5 px-3 pt-4 text-xs font-semibold text-[#0071e3]">
              {admin ? <LayoutDashboard size={16} /> : <Gauge size={16} />}{admin ? "User workspace" : "Admin console"}
            </Link>
          )}
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}

export function PageTitle({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0071e3]">{eyebrow}</p><h1 className="mt-2 font-[family-name:var(--font-serif)] text-3xl font-black text-[#1d1d1f] sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e6e73]">{text}</p></div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="glass-light rounded-3xl p-5">
      <span className="grid size-10 place-items-center rounded-2xl bg-[#0071e3]/8 text-[#0071e3]">{icon}</span>
      <strong className="mt-5 block text-3xl text-[#1d1d1f]">{value}</strong>
      <span className="mt-1 block text-xs text-[#6e6e73]">{label}</span>
    </div>
  );
}
