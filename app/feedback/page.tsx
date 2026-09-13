"use client";

import { useEffect, useState } from "react";
import { AppShell, PageTitle } from "@/components/app-shell";
import { api, type HistoryItem } from "@/lib/api";

export default function FeedbackPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [message, setMessage] = useState("");
  async function load() { setItems(await api<HistoryItem[]>("/api/v1/classification/history")); }
  useEffect(() => { void api<HistoryItem[]>("/api/v1/classification/history").then(setItems); }, []);
  async function send(logId: number, label: "spam" | "ham") { await api("/api/v1/feedback", { method: "POST", body: JSON.stringify({ log_id: logId, confirmed_label: label }) }); setMessage("Feedback saved for future model review."); await load(); }
  return (
    <AppShell>
      <PageTitle eyebrow="Human review" title="Provide feedback" text="Correct or confirm a previous result. Feedback is stored for monitoring and does not retrain the live model automatically." />
      {message && <p className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</p>}
      <div className="glass-light rounded-[30px] p-5 sm:p-7">
        <div className="space-y-3">{items.map((item) => <div key={item.log_id} className="rounded-2xl border border-black/5 bg-white/50 p-4 sm:flex sm:items-center sm:justify-between"><div><p className="max-w-xl truncate text-sm font-medium text-[#1d1d1f]">{item.email_excerpt}</p><p className="mt-1 text-xs text-[#6e6e73]">Predicted {item.predicted_label.toUpperCase()} · {Math.round(item.confidence_score * 100)}% {item.confirmed_label && `· Confirmed ${item.confirmed_label.toUpperCase()}`}</p></div><div className="mt-3 flex gap-2 sm:mt-0"><button onClick={() => send(item.log_id, "ham")} className="rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">Actually ham</button><button onClick={() => send(item.log_id, "spam")} className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-700">Actually spam</button></div></div>)}{!items.length && <p className="p-8 text-center text-sm text-[#6e6e73]">Classify an email before providing feedback.</p>}</div>
      </div>
    </AppShell>
  );
}
