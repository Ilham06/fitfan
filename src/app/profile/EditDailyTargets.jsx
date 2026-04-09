"use client";

import { useState, useRef } from "react";
import { updateDailyTarget } from "./actions";

export default function EditDailyTargets({ target }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(formRef.current);
    await updateDailyTarget(formData);
    setSaving(false);
    setOpen(false);
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-lime-700 font-bold text-xs flex items-center gap-1.5 uppercase tracking-widest"
      >
        Edit{" "}
        <span className="material-symbols-outlined text-sm">settings_suggest</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm px-4 pb-6">
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-lg font-extrabold text-stone-900 mb-6">Edit Daily Targets</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { name: "calories", label: "Calories (kcal)", defaultValue: target?.calories ?? 3200, type: "number" },
                { name: "protein", label: "Protein (g)", defaultValue: target?.protein ?? 185, type: "number", step: "0.1" },
                { name: "carbs", label: "Carbs (g)", defaultValue: target?.carbs ?? 420, type: "number", step: "0.1" },
                { name: "fat", label: "Fat (g)", defaultValue: target?.fat ?? 80, type: "number", step: "0.1" },
                { name: "fiber", label: "Fiber (g) — optional", defaultValue: target?.fiber ?? "", type: "number", step: "0.1", required: false },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1 block">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    step={field.step || "1"}
                    defaultValue={field.defaultValue}
                    required={field.required !== false}
                    className="w-full border border-stone-200 rounded-2xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
              ))}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 rounded-2xl border border-stone-200 text-stone-700 font-semibold text-sm hover:bg-stone-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
