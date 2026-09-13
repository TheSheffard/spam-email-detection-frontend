"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, Mail, MailCheck, UserRound } from "lucide-react";
import { api, type User } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { setAuthenticatedUser } = useAuth();
  const register = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      const user = await api<User>(`/api/v1/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setAuthenticatedUser(user);
      router.refresh();
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to continue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-wash relative grid min-h-screen place-items-center px-5 py-14">
      <div className="glass-light-modal w-full max-w-md rounded-[32px] p-6 sm:p-9">
        <Link href="/" className="mb-8 inline-flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[#0071e3]/10 text-[#0071e3]">
            <MailCheck size={19} />
          </span>
          <span>
            <b className="block text-sm text-[#1d1d1f]">UNIZIK MailGuard</b>
            <small className="text-[#6e6e73]">Secure classification workspace</small>
          </span>
        </Link>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0071e3]">
          {register ? "Create account" : "Welcome back"}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-serif)] text-3xl font-black text-[#1d1d1f]">
          {register ? "Join the workspace" : "Sign in to continue"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#6e6e73]">
          {register
            ? "Create your account to classify messages and keep a private history."
            : "Access your dashboard, history, and secure email checker."}
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          {register && (
            <Field
              icon={<UserRound size={16} />}
              label="Full name"
              name="full_name"
              type="text"
              placeholder="Your full name"
            />
          )}
          <Field
            icon={<Mail size={16} />}
            label="Institutional email"
            name="email"
            type="email"
            placeholder="name@unizik.edu.ng"
          />
          <Field
            icon={<LockKeyhole size={16} />}
            label="Password"
            name="password"
            type="password"
            placeholder="Minimum 8 characters"
          />
          {register && (
            <Field
              icon={<LockKeyhole size={16} />}
              label="Confirm password"
              name="confirm_password"
              type="password"
              placeholder="Repeat password"
            />
          )}
          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1d1d1f] text-sm font-semibold text-white transition hover:bg-[#333] disabled:opacity-50"
          >
            {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
            <ArrowRight size={16} />
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-[#6e6e73]">
          {register ? "Already registered?" : "New to MailGuard?"}{" "}
          <Link
            className="font-semibold text-[#0071e3]"
            href={register ? "/login" : "/register"}
          >
            {register ? "Sign in" : "Create account"}
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  icon,
  label,
  ...props
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.13em] text-[#1d1d1f]">
        {label}
      </span>
      <span className="field-light flex items-center gap-3 rounded-2xl px-4 text-[#86868b]">
        {icon}
        <input
          {...props}
          required
          className="min-h-13 w-full bg-transparent text-sm text-[#1d1d1f] outline-none"
        />
      </span>
    </label>
  );
}
