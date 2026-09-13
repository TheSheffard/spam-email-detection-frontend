"use client";

import { useEffect, useState } from "react";
import { AppShell, PageTitle } from "@/components/app-shell";
import { api } from "@/lib/api";

type Data = { total_classifications: number; spam_classifications: number; ham_classifications: number; average_confidence: number; feedback_total: number; feedback_disagreements: number };

export default function Page() {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => { void api<Data>("/api/v1/admin/dashboard").then(setData); }, []);
  const total = data?.total_classifications || 1;
  const spam = ((data?.spam_classifications || 0) / total) * 100;
  const ham = ((data?.ham_classifications || 0) / total) * 100;
  return (
    <AppShell admin>
      <PageTitle eyebrow="Operational analytics" title="Classification patterns" text="A concise view of predicted classes, model certainty, and human disagreement." />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-light rounded-[30px] p-6"><h2 className="font-bold text-[#1d1d1f]">Spam / ham distribution</h2><Bar label="Spam" value={spam} color="#ff6961" /><Bar label="Ham" value={ham} color="#34c759" /></div>
        <div className="glass-light rounded-[30px] p-6"><h2 className="font-bold text-[#1d1d1f]">Quality signals</h2><div className="mt-5 grid grid-cols-2 gap-3"><Card label="Average confidence" value={`${Math.round((data?.average_confidence || 0) * 100)}%`} /><Card label="Feedback received" value={String(data?.feedback_total ?? 0)} /><Card label="Disagreements" value={String(data?.feedback_disagreements ?? 0)} /><Card label="Manual review policy" value="Below 75%" /></div></div>
      </div>
    </AppShell>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) { return <div className="mt-6"><div className="mb-2 flex justify-between text-xs"><span className="text-[#6e6e73]">{label}</span><b className="text-[#1d1d1f]">{value.toFixed(1)}%</b></div><div className="h-3 overflow-hidden rounded-full bg-black/5"><div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} /></div></div>; }
function Card({ label, value }: { label: string; value: string }) { return <div className="glass-light-soft rounded-2xl p-4"><small className="text-[#6e6e73]">{label}</small><b className="mt-2 block text-xl text-[#1d1d1f]">{value}</b></div>; }
