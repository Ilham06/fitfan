"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveFoodLog } from "./actions";

const MEAL_TYPES = [
  { value: "", label: "— Pilih Waktu Makan —" },
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "LUNCH", label: "Lunch" },
  { value: "DINNER", label: "Dinner" },
  { value: "SNACK", label: "Snack" },
  { value: "PRE_WORKOUT", label: "Pre-Workout" },
  { value: "POST_WORKOUT", label: "Post-Workout" },
];

const EMPTY_ENTRY = {
  name: "",
  weightGrams: "100",
  quantity: "1",
  calories: "",
  protein: "0",
  carbs: "0",
  fat: "0",
  fiber: "",
};

export default function FoodLogForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [mealType, setMealType] = useState("");
  const [entries, setEntries] = useState([{ ...EMPTY_ENTRY }]);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [aiConfidence, setAiConfidence] = useState(null);

  const updateEntry = (idx, field, value) => {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  };

  const addEntry = () => setEntries((prev) => [...prev, { ...EMPTY_ENTRY }]);
  const removeEntry = (idx) => setEntries((prev) => prev.filter((_, i) => i !== idx));

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setScanning(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/ai/food-scan", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "AI scan gagal.");
        setScanning(false);
        return;
      }

      setAiConfidence(data.confidence);

      const aiEntries = data.ingredients?.length
        ? data.ingredients.map((ing) => ({
            name: ing.name,
            weightGrams: String(ing.weightGrams || 100),
            quantity: "1",
            calories: String(ing.calories || 0),
            protein: String(ing.protein || 0),
            carbs: String(ing.carbs || 0),
            fat: String(ing.fat || 0),
            fiber: "",
          }))
        : [
            {
              name: data.name || "Scanned Food",
              weightGrams: "100",
              quantity: "1",
              calories: String(data.totalCalories || 0),
              protein: String(data.totalProtein || 0),
              carbs: String(data.totalCarbs || 0),
              fat: String(data.totalFat || 0),
              fiber: data.totalFiber ? String(data.totalFiber) : "",
            },
          ];

      setEntries(aiEntries);
    } catch {
      setError("Network error saat AI scan.");
    } finally {
      setScanning(false);
    }
  };

  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + (parseFloat(e.calories) || 0),
      protein: acc.protein + (parseFloat(e.protein) || 0),
      carbs: acc.carbs + (parseFloat(e.carbs) || 0),
      fat: acc.fat + (parseFloat(e.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleSave = async () => {
    setError("");
    setSaving(true);

    const result = await saveFoodLog({
      mealType,
      entries: entries.map((e) => ({
        name: e.name,
        weightGrams: e.weightGrams,
        quantity: e.quantity,
        calories: e.calories,
        protein: e.protein,
        carbs: e.carbs,
        fat: e.fat,
        fiber: e.fiber || null,
      })),
    });

    setSaving(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
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
        <p className="text-lg font-bold text-stone-900">Food Log Tersimpan!</p>
        <p className="text-sm text-stone-500">Mengarahkan ke Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AI Scan Upload */}
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
          className="w-full relative aspect-square max-w-[280px] mx-auto block rounded-[2.5rem] overflow-hidden shadow-xl group"
        >
          {previewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Food" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-stone-100 flex flex-col items-center justify-center gap-3 group-hover:bg-lime-50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-lime-100 group-hover:bg-lime-200 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-lime-700 text-3xl">
                  {scanning ? "hourglass_empty" : "camera"}
                </span>
              </div>
              <p className="text-sm font-bold text-stone-600">
                {scanning ? "AI Scanning..." : "Foto Makanan (AI Scan)"}
              </p>
            </div>
          )}
        </button>
        {scanning && (
          <p className="text-center text-xs text-stone-400 mt-2 animate-pulse">
            Analyzing with AI...
          </p>
        )}
        {aiConfidence !== null && !scanning && (
          <p className="text-center text-xs text-lime-600 font-bold mt-2">
            AI Confidence: {aiConfidence}%
          </p>
        )}
      </div>

      {/* Meal Type */}
      <div>
        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2">
          Waktu Makan
        </label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="w-full border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        >
          {MEAL_TYPES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black tracking-[0.15em] uppercase text-stone-400">
            Ingredients / Items
          </h4>
          <button
            type="button"
            onClick={addEntry}
            className="text-primary text-[10px] font-black tracking-widest flex items-center gap-1 uppercase hover:opacity-70 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span> Add
          </button>
        </div>

        <div className="divide-y divide-stone-50 bg-white rounded-[1.5rem] border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          {entries.map((entry, idx) => (
            <div key={idx} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Nama makanan..."
                  value={entry.name}
                  onChange={(e) => updateEntry(idx, "name", e.target.value)}
                  className="font-bold text-sm text-stone-900 bg-transparent border-none focus:outline-none flex-1 placeholder-stone-300"
                />
                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(idx)}
                    className="text-stone-300 hover:text-red-400 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { field: "calories", label: "Kcal", color: "text-primary" },
                  { field: "protein", label: "Prot (g)" },
                  { field: "carbs", label: "Carb (g)" },
                  { field: "fat", label: "Fat (g)" },
                ].map(({ field, label, color }) => (
                  <div key={field} className="bg-stone-50 rounded-xl p-2 text-center">
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter mb-1">
                      {label}
                    </p>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={entry[field]}
                      onChange={(e) => updateEntry(idx, field, e.target.value)}
                      placeholder="0"
                      className={`w-full text-center bg-transparent border-none focus:outline-none font-black text-base ${color || ""} placeholder-stone-300`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-stone-50 rounded-2xl border border-stone-100 p-5">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
          Total
        </p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: "Calories", value: Math.round(totals.calories), unit: "kcal", color: "text-primary" },
            { label: "Protein", value: Math.round(totals.protein), unit: "g" },
            { label: "Carbs", value: Math.round(totals.carbs), unit: "g" },
            { label: "Fat", value: Math.round(totals.fat), unit: "g" },
          ].map(({ label, value, unit, color }) => (
            <div key={label}>
              <p className={`text-lg font-black ${color || "text-stone-900"}`}>{value}</p>
              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter">{unit}</p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
      )}

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || scanning}
        className="w-full h-16 bg-stone-900 text-white rounded-[1.25rem] font-bold text-sm tracking-[0.1em] uppercase flex items-center justify-center gap-3 active:scale-95 transition-all border border-white/10 disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-lg">verified</span>
        {saving ? "Menyimpan..." : "Save to Log"}
      </button>
    </div>
  );
}
