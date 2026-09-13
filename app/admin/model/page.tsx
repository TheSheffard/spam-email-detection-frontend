"use client";

import { useEffect, useState } from "react";
import { AppShell, PageTitle } from "@/components/app-shell";
import { api } from "@/lib/api";

type Model = { model_name: string; trained_at: string; accuracy: number; precision_score: number; recall_score: number; f1_score: number; false_positive_rate: number; is_active: boolean };
type Dataset = { source_name: string; total_samples: number; spam_count: number; ham_count: number };

export default function Page() {
  const [models, setModels] = useState<Model[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  useEffect(() => { void api<Model[]>("/api/v1/admin/model").then(setModels); void api<Dataset[]>("/api/v1/admin/datasets").then(setDatasets); }, []);
  return (
    <AppShell admin>
      <PageTitle eyebrow="Model governance" title="Model and datasets" text="Training remains an offline, controlled process. This screen is read-only operational metadata." />
      <div className="glass-light rounded-[30px] p-6"><h2 className="text-lg font-bold text-[#1d1d1f]">Production model</h2>{models.map((model) => <div key={model.trained_at} className="mt-4 grid gap-3 sm:grid-cols-3"><Info label="Configuration" value={model.model_name} /><Info label="Accuracy" value={percent(model.accuracy)} /><Info label="Precision" value={percent(model.precision_score)} /><Info label="Recall" value={percent(model.recall_score)} /><Info label="F1 score" value={percent(model.f1_score)} /><Info label="False-positive rate" value={percent(model.false_positive_rate)} /></div>)}</div>
      <div className="glass-light mt-5 rounded-[30px] p-6"><h2 className="text-lg font-bold text-[#1d1d1f]">Training sources</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{datasets.map((dataset) => <div key={dataset.source_name} className="glass-light-soft rounded-2xl p-4"><b className="text-sm text-[#1d1d1f]">{dataset.source_name.replaceAll("_", " ")}</b><p className="mt-2 text-xs text-[#6e6e73]">{dataset.total_samples.toLocaleString()} records · {dataset.spam_count.toLocaleString()} spam · {dataset.ham_count.toLocaleString()} ham</p></div>)}</div></div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div className="glass-light-soft rounded-2xl p-4"><small className="text-[#6e6e73]">{label}</small><b className="mt-1 block text-sm text-[#1d1d1f]">{value}</b></div>; }
function percent(value: number) { return `${(value * 100).toFixed(2)}%`; }
