"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfileInfo } from "./actions";

const PHASES = [
  { value: "LEAN_BULKING", label: "Lean Bulking", desc: "Surplus kecil, fokus muscle gain", icon: "trending_up", color: "lime" },
  { value: "BULKING", label: "Bulking", desc: "Surplus besar, mass gain", icon: "fitness_center", color: "amber" },
  { value: "CUTTING", label: "Cutting", desc: "Defisit kalori, fat loss", icon: "local_fire_department", color: "red" },
  { value: "MAINTENANCE", label: "Maintenance", desc: "Jaga berat badan stabil", icon: "balance", color: "stone" },
];

const COLOR_MAP = {
  lime: { bg: "bg-lime-50", border: "border-lime-300", ring: "ring-lime-200", text: "text-lime-700", icon: "bg-lime-100 text-lime-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-300", ring: "ring-amber-200", text: "text-amber-700", icon: "bg-amber-100 text-amber-700" },
  red: { bg: "bg-red-50", border: "border-red-300", ring: "ring-red-200", text: "text-red-600", icon: "bg-red-100 text-red-600" },
  stone: { bg: "bg-stone-50", border: "border-stone-300", ring: "ring-stone-200", text: "text-stone-600", icon: "bg-stone-100 text-stone-600" },
};

export default function EditProfileInfo({ currentPhase, height, goalWeight }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [phase, setPhase] = useState(currentPhase || "LEAN_BULKING");
  const [heightVal, setHeightVal] = useState(height ? String(height) : "");
  const [goalVal, setGoalVal] = useState(goalWeight ? String(goalWeight) : "");

  const handleSave = async () => {
    setSaving(true);
    await updateProfileInfo({
      currentPhase: phase,
      height: heightVal ? parseFloat(heightVal) : null,
      goalWeight: goalVal ? parseFloat(goalVal) : null,
    });
    setSaving(false);
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full hover:bg-stone-100 transition-colors active:scale-95"
      >
        <span className="material-symbols-outlined text-stone-400 text-lg">edit</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm px-4 pb-6">
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-stone-900">Edit Profil</h3>
              <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-stone-100">
                <span className="material-symbols-outlined text-stone-400">close</span>
              </button>
            </div>

            {/* Phase Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Fitness Phase
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {PHASES.map((p) => {
                  const isActive = phase === p.value;
                  const c = COLOR_MAP[p.color];
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPhase(p.value)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        isActive
                          ? `${c.bg} ${c.border} ring-2 ${c.ring}`
                          : "bg-white border-stone-100 hover:border-stone-200"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${isActive ? c.icon : "bg-stone-50 text-stone-400"}`}>
                        <span className="material-symbols-outlined text-base">{p.icon}</span>
                      </div>
                      <p className={`text-sm font-bold ${isActive ? c.text : "text-stone-700"}`}>
                        {p.label}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5 leading-snug">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Height & Goal Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Tinggi Badan
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max="250"
                    step="0.1"
                    value={heightVal}
                    onChange={(e) => setHeightVal(e.target.value)}
                    placeholder="170"
                    className="w-full border border-stone-200 rounded-2xl pl-4 pr-10 py-3 text-sm font-bold text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-lime-200 focus:border-lime-300 transition placeholder-stone-300"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                    cm
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Goal Berat
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="30"
                    max="200"
                    step="0.1"
                    value={goalVal}
                    onChange={(e) => setGoalVal(e.target.value)}
                    placeholder="70"
                    className="w-full border border-stone-200 rounded-2xl pl-4 pr-10 py-3 text-sm font-bold text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-lime-200 focus:border-lime-300 transition placeholder-stone-300"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-3.5 rounded-2xl border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3.5 rounded-2xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
