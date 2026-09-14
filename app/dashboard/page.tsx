"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, History, ScanSearch, ShieldAlert } from "lucide-react";
import { AppShell, PageTitle, StatCard } from "@/components/app-shell";
import { api, type HistoryItem } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => { void api<HistoryItem[]>("/api/v1/classification/history").then(setItems).catch(() => null); }, []);
  const spam = items.filter((item) => item.predicted_label === "spam").length;
  return (
    <AppShell>
      <PageTitle eyebrow={`Welcome${user ? `, ${user.full_name.split(" ")[0]}` : ""}`} title="Dashboard" text="Check an email or review your recent classification activity." action={<Link href="/classify" className="inline-flex items-center gap-2 rounded-lg bg-[#1d1d1f] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#333]">Check email <ArrowRight size={15} /></Link>} />
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Total classifications" value={items.length} icon={<ScanSearch size={19} />} /><StatCard label="Spam detected" value={spam} icon={<ShieldAlert size={19} />} /><StatCard label="Legitimate detected" value={items.length - spam} icon={<CheckCircle2 size={19} />} /></div>
      <div className="mt-6 rounded-xl border border-black/10 bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><h2 className="text-base font-semibold text-[#1d1d1f]">Recent classifications</h2><Link href="/history" className="flex items-center gap-2 text-xs font-semibold text-[#0071e3]"><History size={15} />View all</Link></div><HistoryRows items={items.slice(0, 5)} /></div>
    </AppShell>
  );
}

export function HistoryRows({ items }: { items: HistoryItem[] }) {
  if (!items.length) return <p className="mt-5 rounded-lg border border-dashed border-black/15 p-7 text-center text-sm text-[#6e6e73]">No classifications yet.</p>;
  return <div className="mt-4 divide-y divide-black/10 border-t border-black/10">{items.map((item) => <div key={item.log_id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"><div className="min-w-0"><p className="truncate text-sm font-medium text-[#1d1d1f]">{item.email_excerpt}</p><p className="mt-1 text-[11px] text-[#6e6e73]">{new Date(item.submitted_at).toLocaleString()}</p></div><span className={`w-fit rounded-md px-2.5 py-1 text-[10px] font-bold uppercase ${item.predicted_label === "spam" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{item.predicted_label}</span><b className="text-sm text-[#1d1d1f]">{Math.round(item.confidence_score * 100)}%</b></div>)}</div>;
}
