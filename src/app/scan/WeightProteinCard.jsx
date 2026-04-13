"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateWeightAndTargets } from "./actions";

const PHASE_CONFIG = {
  LEAN_BULKING: { label: "Lean Bulk", min: 1.8, max: 2.2, rec: 2.0, color: "lime" },
  BULKING: { label: "Bulking", min: 1.6, max: 2.0, rec: 1.8, color: "amber" },
  CUTTING: { label: "Cutting", min: 2.0, max: 2.4, rec: 2.2, color: "red" },
  MAINTENANCE: { label: "Maintenance", min: 1.4, max: 1.8, rec: 1.6, color: "stone" },
};

export default function WeightProteinCard({ currentWeight, currentPhase, currentProteinTarget }) {
  const router = useRouter();
  const [weight, setWeight] = useState(currentWeight ? String(currentWeight) : "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const phase = PHASE_CONFIG[currentPhase] || PHASE_CONFIG.LEAN_BULKING;
  const kg = parseFloat(weight) || 0;

  const proteinMin = kg > 0 ? Math.round(kg * phase.min) : 0;
  const proteinRec = kg > 0 ? Math.round(kg * phase.rec) : 0;
  const proteinMax = kg > 0 ? Math.round(kg * phase.max) : 0;

  const hasProteinTarget = currentProteinTarget != null;
  const targetDiff = hasProteinTarget ? proteinRec - currentProteinTarget : 0;

  const handleSave = async (applyProtein) => {
    if (!kg || kg < 20) {
      setError("Masukkan berat badan yang valid.");
      return;
    }
    setError("");
    setSaving(true);
    const result = await updateWeightAndTargets({
      weight: kg,
      applyProtein,
      proteinGrams: proteinRec,
    });
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.refresh();
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-stone-100 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-stone-900 text-white p-2.5 rounded-2xl">
          <span
            className="material-symbols-outlined block text-lg"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            monitor_weight
          </span>
        </div>
        <div>
          <h3 className="text-base font-extrabold tracking-tight text-stone-900">Berat Badan</h3>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
            {phase.label} &middot; {phase.min}–{phase.max}g protein/kg
          </p>
        </div>
      </div>

      {/* Weight Input */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="number"
            min="20"
            max="300"
            step="0.1"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setSaved(false);
            }}
            placeholder="Berat badan..."
            className="w-full border border-stone-200 rounded-2xl pl-4 pr-12 py-3.5 text-lg font-bold text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition placeholder-stone-300"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400">
            kg
          </span>
        </div>
      </div>

      {/* Protein Suggestion */}
      {kg > 0 && (
        <div className="bg-lime-50 border border-lime-100 rounded-2xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-lime-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-lime-800 text-sm">
                tips_and_updates
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-lime-900">Kebutuhan Protein Harian</p>
              <p className="text-xs text-lime-700/80 leading-relaxed">
                Untuk fase <span className="font-bold">{phase.label}</span> dengan BB{" "}
                <span className="font-bold">{kg} kg</span>, kamu butuh:
              </p>
            </div>
          </div>

          {/* Protein Range */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/60 rounded-xl py-3 px-2">
              <p className="text-[9px] font-bold text-lime-600 uppercase tracking-wider mb-1">Minimum</p>
              <p className="text-lg font-black text-lime-800">{proteinMin}g</p>
              <p className="text-[9px] text-lime-600/60">{phase.min}g/kg</p>
            </div>
            <div className="bg-lime-200/50 rounded-xl py-3 px-2 ring-2 ring-lime-300/50">
              <p className="text-[9px] font-bold text-lime-700 uppercase tracking-wider mb-1">Rekomendasi</p>
              <p className="text-2xl font-black text-lime-900">{proteinRec}g</p>
              <p className="text-[9px] text-lime-600/60">{phase.rec}g/kg</p>
            </div>
            <div className="bg-white/60 rounded-xl py-3 px-2">
              <p className="text-[9px] font-bold text-lime-600 uppercase tracking-wider mb-1">Maksimum</p>
              <p className="text-lg font-black text-lime-800">{proteinMax}g</p>
              <p className="text-[9px] text-lime-600/60">{phase.max}g/kg</p>
            </div>
          </div>

          {/* Current target comparison */}
          {hasProteinTarget && (
            <div className="flex items-center gap-2 bg-white/80 rounded-xl px-4 py-2.5">
              <span className="material-symbols-outlined text-sm text-stone-400">compare_arrows</span>
              <p className="text-xs text-stone-600">
                Target saat ini: <span className="font-bold">{Math.round(currentProteinTarget)}g</span>
                {targetDiff !== 0 && (
                  <span className={`ml-1 font-bold ${targetDiff > 0 ? "text-amber-600" : "text-lime-700"}`}>
                    ({targetDiff > 0 ? "+" : ""}{targetDiff}g {targetDiff > 0 ? "kurang" : "lebih"})
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">{error}</p>}

      {saved && (
        <div className="flex items-center gap-2 bg-lime-50 rounded-xl px-4 py-2.5">
          <span className="material-symbols-outlined text-lime-700 text-sm">check_circle</span>
          <p className="text-sm font-bold text-lime-800">Tersimpan!</p>
        </div>
      )}

      {/* Action Buttons */}
      {kg > 0 && !saved && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex-1 py-3.5 rounded-2xl border border-stone-200 text-stone-700 font-bold text-xs uppercase tracking-widest hover:bg-stone-50 transition disabled:opacity-50"
          >
            {saving ? "..." : "Simpan BB"}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex-1 py-3.5 rounded-2xl bg-lime-700 text-white font-bold text-xs uppercase tracking-widest hover:bg-lime-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">bolt</span>
            {saving ? "..." : `Terapkan ${proteinRec}g`}
          </button>
        </div>
      )}
    </div>
  );
}
