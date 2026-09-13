"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Eraser, LoaderCircle, MailSearch, ScanSearch, ShieldAlert, X } from "lucide-react";
import { api, classifyEmail, type Prediction } from "@/lib/api";

const MINIMUM_VERIFYING_TIME_MS = 2000;

const examples = {
  suspicious: { subject: "Urgent: your university account will be suspended", body: "Your mailbox must be verified today. Open the link below and enter your username and password to prevent permanent account deletion." },
  moderateSpam: {
    subject: "Special student offer ends this week",
    body: "Hello, we are offering selected university students a limited discount on laptops and study materials. Register through our website before Friday to reserve your offer. This promotion is optional, and you may ignore this message if you are not interested.",
  },
  legitimate: { subject: "Final year project supervision meeting", body: "Please bring your corrected methodology chapter to the Computer Science departmental office on Monday at 11:00 a.m." },
};

function delay(milliseconds: number) { return new Promise((resolve) => window.setTimeout(resolve, milliseconds)); }

export function EmailClassifier({ compact = false }: { compact?: boolean }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState<Prediction | null>(null);
  const [error, setError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);
  async function analyse() {
    if (!subject.trim() && !body.trim()) { setError("Paste an email subject or message body first."); return; }
    setError(""); setResult(null); setFeedbackMessage(""); setLoading(true); setModalOpen(true);
    try {
      const [prediction] = await Promise.all([
        classifyEmail(subject, body),
        delay(MINIMUM_VERIFYING_TIME_MS),
      ]);
      setResult(prediction);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The message could not be analysed.");
    } finally { setLoading(false); }
  }

  function clear() { setSubject(""); setBody(""); setResult(null); setError(""); setFeedbackMessage(""); }
  function closeModal() { if (!loading) setModalOpen(false); }
  function loadExample(example: keyof typeof examples) { setSubject(examples[example].subject); setBody(examples[example].body); setResult(null); setError(""); }
  async function confirmLabel(label: "spam" | "ham") {
    if (!result) return;
    await api("/api/v1/feedback", { method: "POST", body: JSON.stringify({ log_id: result.log_id, confirmed_label: label }) });
    setFeedbackMessage("Feedback saved for future model review.");
  }

  const isSpam = result?.label === "spam";
  return (
    <>
      <section id="checker" className={compact ? "" : "scroll-mt-28 py-20 sm:py-28"}>
        <div className={compact ? "" : "mx-auto max-w-6xl px-5 sm:px-8"}>
          {!compact && (
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-[#1d1d1f] sm:text-4xl">Check an email</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#6e6e73] sm:text-base">Enter the subject and message body to check whether the email may be spam. Do not include passwords, OTPs, or bank details.</p>
            </div>
          )}

          <div className="glass-light rounded-2xl p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div><p className="text-base font-bold text-[#1d1d1f]">New email analysis</p><p className="mt-1 text-sm text-[#6e6e73]">Text-only machine-learning assessment</p></div>
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#0071e3]"><MailSearch size={21} /></span>
            </div>
            <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
              <div className="flex flex-col">
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-[0.14em] text-[#1d1d1f]">Email subject</label>
                <input id="subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Paste the subject line" maxLength={500} className="field-light mt-2.5 min-h-14 w-full rounded-2xl px-4 text-sm outline-none transition" />
                <div className="mt-4 rounded-xl border border-black/10 bg-[#fafafa] p-4">
                  <p className="text-xs font-bold text-[#1d1d1f]">Need sample text?</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => loadExample("suspicious")} className="rounded-full border border-black/10 bg-white px-3 py-2 text-[11px] font-semibold text-[#1d1d1f] transition hover:bg-gray-50">Suspicious email</button>
                    <button onClick={() => loadExample("moderateSpam")} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-800 transition hover:bg-amber-100">Moderate-risk email</button>
                    <button onClick={() => loadExample("legitimate")} className="rounded-full border border-black/10 bg-white px-3 py-2 text-[11px] font-semibold text-[#1d1d1f] transition hover:bg-gray-50">University notice</button>
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-[#6e6e73]">You can use one of these examples to test the checker.</p>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-end justify-between gap-4"><label htmlFor="body" className="text-xs font-bold uppercase tracking-[0.14em] text-[#1d1d1f]">Message body</label><span className="text-[11px] text-[#6e6e73]">{body.length.toLocaleString()} / 20,000</span></div>
                <textarea id="body" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Paste the email content here..." maxLength={20_000} rows={9} className="field-light mt-2.5 w-full flex-1 resize-y rounded-2xl px-4 py-4 text-sm leading-6 outline-none transition" />
              </div>
            </div>
            {error && !modalOpen && <div role="alert" className="mt-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertTriangle className="mt-0.5 shrink-0" size={17} />{error}</div>}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-black/5 pt-6">
              <button onClick={analyse} disabled={loading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#1d1d1f] px-6 text-sm font-semibold text-white transition hover:bg-[#333] disabled:opacity-50"><ScanSearch size={17} />Verify email</button>
              <button onClick={clear} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-5 text-sm font-semibold text-[#1d1d1f] transition hover:bg-gray-50"><Eraser size={16} />Clear</button>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/20 px-3 py-4 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <div className="glass-light-modal relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl p-5 sm:max-h-[calc(100dvh-3rem)] sm:p-7" role="dialog" aria-modal="true" aria-labelledby="analysis-title">
            {!loading && <button onClick={closeModal} aria-label="Close analysis" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-black/10 bg-white/70 text-[#1d1d1f] transition hover:bg-white"><X size={18} /></button>}
            {loading ? (
              <div className="py-10 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-blue-50 text-[#0071e3]"><LoaderCircle className="animate-spin" size={27} /></span>
                <h3 id="analysis-title" className="mt-5 text-xl font-bold text-[#1d1d1f] sm:text-2xl">Verifying email…</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#6e6e73]">Please wait while the message is checked.</p>
              </div>
            ) : error ? (
              <div className="py-5 text-center"><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-red-500"><AlertTriangle size={30} /></span><h3 id="analysis-title" className="mt-5 text-2xl font-black text-[#1d1d1f]">Analysis could not finish</h3><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6e6e73]">{error}</p><button onClick={closeModal} className="mt-6 rounded-full bg-[#1d1d1f] px-6 py-3 text-sm font-semibold text-white">Return to checker</button></div>
            ) : result && (
              <div>
                <div className="flex items-center gap-4 pr-10"><span className={`grid size-16 shrink-0 place-items-center rounded-2xl ${isSpam ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>{isSpam ? <ShieldAlert size={31} /> : <CheckCircle2 size={31} />}</span><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0071e3]">Analysis complete</p><h3 id="analysis-title" className="mt-1 text-2xl font-black text-[#1d1d1f] sm:text-3xl">{result.display_label}</h3></div></div>
                <div className="glass-light-soft mt-7 rounded-3xl p-5"><div className="flex items-end justify-between gap-4"><div><p className="text-xs text-[#6e6e73]">Model confidence</p><p className="mt-1 text-sm font-bold text-[#1d1d1f]">{result.model_name}</p></div><strong className="text-3xl font-black text-[#1d1d1f]">{Math.round(result.confidence * 100)}%</strong></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-black/5"><div className={`h-full rounded-full ${isSpam ? "bg-red-400" : "bg-green-500"}`} style={{ width: `${Math.round(result.confidence * 100)}%` }} /></div><div className="mt-5 grid grid-cols-2 gap-3 text-center"><Probability label="Spam probability" value={result.spam_probability} /><Probability label="Legitimate probability" value={result.ham_probability} /></div></div>
                <div className="mt-4 rounded-2xl bg-blue-50 p-4"><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#0071e3]">Recommended action</p><p className="mt-2 text-sm leading-6 text-[#1d1d1f]">{result.guidance}</p></div>
                {result.needs_review && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><b>Manual review advised.</b> Confidence is below the configured {Math.round(result.confidence_threshold * 100)}% threshold.</div>}
                {!!result.influential_terms.length && <div className="mt-4"><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#6e6e73]">Influential terms</p><div className="mt-2 flex flex-wrap gap-2">{result.influential_terms.map((term) => <span key={term} className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs text-[#1d1d1f]">{term}</span>)}</div></div>}
                <div className="mt-5 border-t border-black/5 pt-5"><p className="text-xs font-bold text-[#1d1d1f]">Was this classification correct?</p><div className="mt-3 flex gap-2"><button onClick={() => confirmLabel(result.label)} className="rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">Yes, correct</button><button onClick={() => confirmLabel(result.label === "spam" ? "ham" : "spam")} className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-700">No, incorrect</button></div>{feedbackMessage && <p className="mt-3 text-xs text-[#0071e3]">{feedbackMessage}</p>}</div>
                <button onClick={closeModal} className="mt-6 w-full rounded-full bg-[#1d1d1f] py-3.5 text-sm font-semibold text-white transition hover:bg-[#333]">Check another email</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Probability({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-black/[0.03] p-3"><span className="block text-[11px] text-[#6e6e73]">{label}</span><strong className="mt-1 block text-lg text-[#1d1d1f]">{Math.round(value * 100)}%</strong></div>;
}
