"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, History, ShieldAlert, Users } from "lucide-react";
import { AppShell, PageTitle, StatCard } from "@/components/app-shell";
import { API_URL, api, type User } from "@/lib/api";

type RecordValue = string | number | boolean | null | undefined | Record<string, unknown> | unknown[];
type AdminDashboard = { total_users: number; total_classifications: number; spam_classifications: number; feedback_total: number; active_model: null | { model_name: string; accuracy: number; f1_score: number; false_positive_rate: number } };

export function AdminOverview() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  useEffect(() => { void api<AdminDashboard>("/api/v1/admin/dashboard").then(setData); }, []);
  return (
    <AppShell admin>
      <PageTitle eyebrow="System administration" title="Operational overview" text="Monitor use, classifier output, feedback, and the active production model." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Registered users" value={data?.total_users ?? "—"} icon={<Users size={19} />} /><StatCard label="Classifications" value={data?.total_classifications ?? "—"} icon={<History size={19} />} /><StatCard label="Spam detected" value={data?.spam_classifications ?? "—"} icon={<ShieldAlert size={19} />} /><StatCard label="Feedback received" value={data?.feedback_total ?? "—"} icon={<CheckCircle2 size={19} />} /></div>
      <div className="glass-light mt-6 rounded-[30px] p-6"><h2 className="text-lg font-bold text-[#1d1d1f]">Active model</h2>{data?.active_model ? <div className="mt-4 grid gap-3 sm:grid-cols-4">{[["Configuration", data.active_model.model_name], ["Accuracy", percent(data.active_model.accuracy)], ["F1 score", percent(data.active_model.f1_score)], ["False positives", percent(data.active_model.false_positive_rate)]].map(([label, value]) => <Info key={label} label={label} value={value} />)}</div> : <p className="mt-4 text-sm text-[#6e6e73]">Model metadata is loading.</p>}</div>
    </AppShell>
  );
}

export function AdminTable({ title, text, path, columns, exportButton = false }: { title: string; text: string; path: string; columns: string[]; exportButton?: boolean }) {
  const [rows, setRows] = useState<Record<string, RecordValue>[]>([]);
  useEffect(() => { void api<Record<string, RecordValue>[]>(path).then(setRows); }, [path]);
  return (
    <AppShell admin>
      <PageTitle eyebrow="Administration" title={title} text={text} action={exportButton ? <a href={`${API_URL}/api/v1/admin/export`} className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#333]"><Download size={15} />Export CSV</a> : undefined} />
      <div className="glass-light overflow-x-auto rounded-[30px] p-5"><table className="w-full min-w-[700px] text-left text-xs"><thead><tr>{columns.map((column) => <th key={column} className="border-b border-black/5 px-3 py-4 uppercase tracking-wider text-[#6e6e73]">{column.replaceAll("_", " ")}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={String(row.log_id ?? row.feedback_id ?? row.dataset_id ?? row.model_id ?? index)} className="border-b border-black/5">{columns.map((column) => <td key={column} className="max-w-[280px] truncate px-3 py-4 text-[#1d1d1f]">{format(row[column])}</td>)}</tr>)}</tbody></table>{!rows.length && <p className="p-8 text-center text-[#6e6e73]">No records available.</p>}</div>
    </AppShell>
  );
}

export function AdminUsers() {
  const [rows, setRows] = useState<User[]>([]);
  async function load() { setRows(await api<User[]>("/api/v1/admin/users")); }
  useEffect(() => { void api<User[]>("/api/v1/admin/users").then(setRows); }, []);
  async function toggle(user: User) { await api(`/api/v1/admin/users/${user.user_id}`, { method: "PUT", body: JSON.stringify({ is_active: !user.is_active }) }); await load(); }
  return (
    <AppShell admin>
      <PageTitle eyebrow="Administration" title="User management" text="Review roles and enable or disable access. Password hashes are never exposed." />
      <div className="glass-light rounded-[30px] p-5"><div className="space-y-2">{rows.map((user) => <div key={user.user_id} className="flex items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white/50 p-4"><div><b className="text-sm text-[#1d1d1f]">{user.full_name}</b><p className="text-xs text-[#6e6e73]">{user.email} · {user.role}</p></div><button onClick={() => toggle(user)} className={`rounded-full px-3 py-2 text-[10px] font-bold ${user.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{user.is_active ? "ACTIVE" : "DISABLED"}</button></div>)}</div></div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div className="glass-light-soft rounded-2xl p-4"><small className="text-[#6e6e73]">{label}</small><b className="mt-1 block text-sm text-[#1d1d1f]">{value}</b></div>; }
function percent(value: number) { return `${(value * 100).toFixed(2)}%`; }
function format(value: RecordValue) { if (value === null || value === undefined) return "—"; if (typeof value === "object") return JSON.stringify(value); if (typeof value === "boolean") return value ? "Yes" : "No"; if (typeof value === "number" && value > 0 && value < 1) return percent(value); return String(value); }
