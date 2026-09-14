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
    <main className="min-h-screen bg-[#f5f5f5]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href={admin ? "/admin" : "/dashboard"} className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-[#0071e3] text-white"><MailCheck size={18} /></span>
            <span className="leading-tight"><b className="block text-sm text-[#1d1d1f]">MailGuard</b><small className="hidden text-[#6e6e73] sm:block">{admin ? "Admin panel" : "Email checker"}</small></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block"><b className="block text-xs text-[#1d1d1f]">{user.full_name}</b><small className="capitalize text-[#6e6e73]">{user.role}</small></span>
            <button onClick={logout} aria-label="Log out" className="grid size-9 place-items-center rounded-lg border border-black/10 bg-white text-[#1d1d1f] transition hover:bg-gray-50"><LogOut size={16} /></button>
          </div>
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:px-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit overflow-x-auto rounded-xl border border-black/10 bg-white p-3">
          <p className="px-3 pb-2 pt-1 text-xs font-semibold text-[#6e6e73]">{admin ? "Administration" : "Menu"}</p>
          <div className="flex min-w-max gap-1 lg:block lg:min-w-0">
            {links.map(([href, label, Icon]) => (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition lg:my-1 ${pathname === href ? "bg-[#eef5ff] text-[#0066cc]" : "text-[#555] hover:bg-gray-50 hover:text-[#1d1d1f]"}`}>
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
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-medium text-[#6e6e73]">{eyebrow}</p><h1 className="mt-1 text-2xl font-bold text-[#1d1d1f] sm:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e6e73]">{text}</p></div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-[#6e6e73]">{label}</span>
        <span className="text-[#0071e3]">{icon}</span>
      </div>
      <strong className="mt-3 block text-2xl text-[#1d1d1f]">{value}</strong>
    </div>
  );
}
