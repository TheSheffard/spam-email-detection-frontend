"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell, PageTitle } from "@/components/app-shell";
import { api, type User } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";

export default function ProfilePage() {
  const { refresh } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => { void api<User>("/api/v1/profile").then(setUser); }, []);
  async function updateProfile(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); setUser(await api<User>("/api/v1/profile", { method: "PUT", body: JSON.stringify(data) })); await refresh(); setMessage("Profile updated."); }
  async function updatePassword(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; await api("/api/v1/profile/password", { method: "PUT", body: JSON.stringify(Object.fromEntries(new FormData(form))) }); form.reset(); setMessage("Password updated."); }
  return (
    <AppShell>
      <PageTitle eyebrow="Account settings" title="Profile and security" text="Update permitted account information. Your role can only be changed by an administrator." />
      {message && <p className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</p>}
      <div className="grid gap-5 xl:grid-cols-2">
        <form onSubmit={updateProfile} className="glass-light rounded-[30px] p-6"><h2 className="text-lg font-bold text-[#1d1d1f]">Profile</h2><FormField name="full_name" label="Full name" defaultValue={user?.full_name} /><FormField name="email" label="Email" type="email" defaultValue={user?.email} /><button className="mt-5 rounded-full bg-[#1d1d1f] px-5 py-3 text-xs font-semibold text-white hover:bg-[#333]">Save profile</button></form>
        <form onSubmit={updatePassword} className="glass-light rounded-[30px] p-6"><h2 className="text-lg font-bold text-[#1d1d1f]">Change password</h2><FormField name="current_password" label="Current password" type="password" /><FormField name="new_password" label="New password" type="password" /><button className="mt-5 rounded-full bg-[#1d1d1f] px-5 py-3 text-xs font-semibold text-white hover:bg-[#333]">Update password</button></form>
      </div>
    </AppShell>
  );
}

function FormField({ name, label, type = "text", defaultValue }: { name: string; label: string; type?: string; defaultValue?: string }) {
  return <label className="mt-5 block"><span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#1d1d1f]">{label}</span><input key={defaultValue} name={name} type={type} defaultValue={defaultValue} required minLength={type === "password" ? 8 : 2} className="field-light min-h-12 w-full rounded-2xl px-4 text-sm outline-none" /></label>;
}
