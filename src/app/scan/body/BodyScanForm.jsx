"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveBodyScan } from "./actions";

const FIELDS = [
  { name: "weight", label: "Weight", unit: "KG", required: true, step: "0.1" },
  { name: "bodyFatPercent", label: "Body Fat", unit: "%", step: "0.1" },
  { name: "muscleMass", label: "Muscle Mass", unit: "KG", step: "0.1" },
  { name: "bmi", label: "BMI Index", unit: "SCORE", step: "0.01" },
];

export default function BodyScanForm({ latestScan }) {
  const router = useRouter();
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [values, setValues] = useState({
    weight: latestScan?.weight?.toFixed(1) ?? "",
    bodyFatPercent: latestScan?.bodyFatPercent?.toFixed(1) ?? "",
    muscleMass: latestScan?.muscleMass?.toFixed(1) ?? "",
    bmi: latestScan?.bmi?.toFixed(1) ?? "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setScanning(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/ai/body-scan", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "OCR gagal. Masukkan data manual.");
        setScanning(false);
        return;
      }

      setAiConfidence(data.confidence);
      setValues((prev) => ({
        ...prev,
        weight: data.weight != null ? String(data.weight) : prev.weight,
        bodyFatPercent: data.bodyFatPercent != null ? String(data.bodyFatPercent) : prev.bodyFatPercent,
        muscleMass: data.muscleMass != null ? String(data.muscleMass) : prev.muscleMass,
        bmi: data.bmi != null ? String(data.bmi) : prev.bmi,
        date: data.date ?? prev.date,
      }));
    } catch {
      setError("Network error saat OCR scan.");
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(formRef.current);
    const result = await saveBodyScan(formData);

    setSaving(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/progress");
        router.refresh();
      }, 1500);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full bg-lime-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-lime-700 text-3xl">check_circle</span>
        </div>
        <p className="text-lg font-bold text-stone-900">Data Tersimpan!</p>
        <p className="text-sm text-stone-500">Mengarahkan ke Progress...</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* OCR Upload */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={scanning}
          className="w-full relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-stone-200/60 shadow-sm flex flex-col items-center justify-center group"
        >
          {previewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Scale" className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
              </div>
            </>
          ) : (
            <div className="relative z-10 flex flex-col items-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-lime-100 flex items-center justify-center mb-4 shadow-sm">
                <span className="material-symbols-outlined text-lime-800 text-3xl">
                  {scanning ? "hourglass_empty" : "qr_code_scanner"}
                </span>
              </div>
              <p className="font-bold text-lg text-stone-900 mb-1">
                {scanning ? "AI Reading..." : "Scan Receipt"}
              </p>
              <p className="text-xs text-stone-500 max-w-[200px] leading-relaxed">
                Center the scale display or printed receipt in the frame
              </p>
            </div>
          )}
        </button>
        {scanning && (
          <p className="text-center text-xs text-stone-400 mt-2 animate-pulse">
            OCR Processing...
          </p>
        )}
        {aiConfidence !== null && !scanning && (
          <p className="text-center text-xs text-lime-600 font-bold mt-2">
            OCR Confidence: {aiConfidence}%
          </p>
        )}
      </div>

      {/* Metric Inputs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Extracted Metrics
          </h2>
          <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-stone-100 text-stone-500 px-3 py-1.5 rounded-full border border-stone-200/50">
            {aiConfidence !== null ? `AI ${aiConfidence}%` : "Manual"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {FIELDS.map(({ name, label, unit, required, step }) => (
            <div
              key={name}
              className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-stone-100 flex flex-col gap-1 transition-all hover:shadow-md"
            >
              <label
                htmlFor={name}
                className="text-[10px] font-bold text-stone-400 uppercase tracking-widest"
              >
                {label}
              </label>
              <div className="flex items-baseline justify-between">
                <input
                  id={name}
                  name={name}
                  className="w-full bg-transparent border-none p-0 text-2xl font-bold text-stone-900 focus:ring-0 focus:outline-none"
                  type="number"
                  step={step || "1"}
                  min="0"
                  required={required}
                  value={values[name]}
                  onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
                  placeholder="—"
                />
                <span className="text-xs font-bold text-stone-400">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-stone-50 border border-stone-200/50 p-5 rounded-2xl flex items-center justify-between">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
            Entry Date
          </p>
          <input
            name="date"
            type="date"
            value={values.date}
            onChange={(e) => setValues((v) => ({ ...v, date: e.target.value }))}
            className="font-bold text-stone-900 bg-transparent border-none focus:outline-none focus:ring-0 w-full text-sm"
          />
        </div>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-600 shadow-sm border border-stone-100">
          <span className="material-symbols-outlined text-xl">calendar_today</span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
      )}

      {/* Save CTA */}
      <button
        type="submit"
        disabled={saving || scanning}
        className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-stone-900/10 flex items-center justify-center gap-3 active:scale-[0.97] transition-all hover:bg-stone-800 disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-xl">save</span>
        {saving ? "Menyimpan..." : "Save Progress"}
      </button>
    </form>
  );
}
