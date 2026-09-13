import Link from "next/link";
import { ArrowRight, LockKeyhole, ScanSearch, ShieldCheck } from "lucide-react";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <main id="top" className="page-wash relative min-h-screen overflow-hidden">
      <Header />

      <section className="relative z-10 pb-16 pt-40 sm:pb-20 sm:pt-48">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h1 className="text-4xl font-bold leading-tight text-[#1d1d1f] sm:text-5xl lg:text-6xl">
            Check suspicious emails before you respond
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#6e6e73] sm:text-lg">
            MailGuard helps members of the UNIZIK community check whether an email message may be spam.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex min-h-13 items-center gap-2 rounded-full bg-[#1d1d1f] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[#333]">
              Create account <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/login" className="inline-flex min-h-13 items-center gap-2 rounded-full border border-black/10 bg-white/70 px-7 text-sm font-semibold text-[#1d1d1f] transition hover:bg-white">
              <LockKeyhole size={16} aria-hidden="true" /> Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <div className="glass-light grid gap-4 rounded-2xl p-5 sm:grid-cols-3 sm:p-7">
          <Feature icon={<ScanSearch size={20} />} title="Text-only analysis" text="Submit an email subject and body through the protected workspace." />
          <Feature icon={<ShieldCheck size={20} />} title="Measured confidence" text="See spam or ham, confidence, influential terms, and low-confidence warnings." />
          <Feature icon={<LockKeyhole size={20} />} title="Private history" text="Only a short excerpt is retained for your personal classification history." />
        </div>
      </section>

      <footer className="relative z-10 border-t border-black/5 py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 text-xs text-[#6e6e73] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-bold text-[#1d1d1f]">UNIZIK MailGuard</p>
          <p>Educational decision-support system · Verify critical requests through official channels</p>
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="glass-light-soft rounded-xl p-5">
      <span className="grid size-10 place-items-center rounded-lg bg-[#0071e3]/8 text-[#0071e3]">{icon}</span>
      <h2 className="mt-5 text-sm font-bold text-[#1d1d1f]">{title}</h2>
      <p className="mt-2 text-xs leading-5 text-[#6e6e73]">{text}</p>
    </div>
  );
}
