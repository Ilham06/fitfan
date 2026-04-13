"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveFoodLog, deleteFoodLog } from "./actions";
import FOOD_DATABASE, { FOOD_CATEGORIES } from "@/lib/food-database";

const MEAL_TYPES = [
  { value: "", label: "— Pilih Waktu Makan —" },
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "LUNCH", label: "Lunch" },
  { value: "DINNER", label: "Dinner" },
  { value: "SNACK", label: "Snack" },
  { value: "PRE_WORKOUT", label: "Pre-Workout" },
  { value: "POST_WORKOUT", label: "Post-Workout" },
];

const MEAL_LABELS = Object.fromEntries(MEAL_TYPES.filter((m) => m.value).map((m) => [m.value, m.label]));

function calcNutrition(foodItem, grams) {
  const ratio = grams / 100;
  return {
    calories: Math.round(foodItem.calories * ratio),
    protein: +(foodItem.protein * ratio).toFixed(1),
    carbs: +(foodItem.carbs * ratio).toFixed(1),
    fat: +(foodItem.fat * ratio).toFixed(1),
    fiber: +(foodItem.fiber * ratio).toFixed(1),
  };
}

const EMPTY_ENTRY = {
  name: "",
  weightGrams: "100",
  quantity: "1",
  calories: "",
  protein: "0",
  carbs: "0",
  fat: "0",
  fiber: "",
  _foodRef: null,
};

export default function FoodLogForm({ todayLogs = [] }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [mode, setMode] = useState("manual");
  const [mealType, setMealType] = useState("");
  const [entries, setEntries] = useState([{ ...EMPTY_ENTRY }]);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [aiConfidence, setAiConfidence] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [showPicker, setShowPicker] = useState(false);
  const [activeEntryIdx, setActiveEntryIdx] = useState(null);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setEntries([{ ...EMPTY_ENTRY }]);
        setMealType("");
        setPreviewUrl(null);
        setAiConfidence(null);
        router.refresh();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const filteredFoods = useMemo(() => {
    let foods = FOOD_DATABASE;
    if (selectedCategory !== "Semua") {
      foods = foods.filter((f) => f.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      foods = foods.filter((f) => f.name.toLowerCase().includes(q));
    }
    return foods;
  }, [searchQuery, selectedCategory]);

  const updateEntry = (idx, field, value) => {
    setEntries((prev) =>
      prev.map((e, i) => {
        if (i !== idx) return e;
        const updated = { ...e, [field]: value };
        if (field === "weightGrams" && e._foodRef) {
          const grams = parseFloat(value) || 0;
          const calc = calcNutrition(e._foodRef, grams);
          return { ...updated, ...calc, calories: String(calc.calories), protein: String(calc.protein), carbs: String(calc.carbs), fat: String(calc.fat), fiber: String(calc.fiber) };
        }
        return updated;
      })
    );
  };

  const selectFood = (food) => {
    const grams = 100;
    const calc = calcNutrition(food, grams);
    setEntries((prev) =>
      prev.map((e, i) =>
        i === activeEntryIdx
          ? {
              ...e,
              name: food.name,
              weightGrams: String(grams),
              calories: String(calc.calories),
              protein: String(calc.protein),
              carbs: String(calc.carbs),
              fat: String(calc.fat),
              fiber: String(calc.fiber),
              _foodRef: food,
            }
          : e
      )
    );
    setShowPicker(false);
    setSearchQuery("");
  };

  const addEntry = () => setEntries((prev) => [...prev, { ...EMPTY_ENTRY }]);
  const removeEntry = (idx) => setEntries((prev) => prev.filter((_, i) => i !== idx));

  const openPicker = (idx) => {
    setActiveEntryIdx(idx);
    setShowPicker(true);
    setSearchQuery("");
    setSelectedCategory("Semua");
  };

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
            _foodRef: null,
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
              _foodRef: null,
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
    }
  };

  const handleDelete = async (logId) => {
    setDeletingId(logId);
    const result = await deleteFoodLog(logId);
    setDeletingId(null);
    if (result?.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
  };

  const dayTotals = todayLogs.reduce(
    (acc, log) => {
      for (const e of log.entries) {
        acc.calories += e.calories;
        acc.protein += e.protein;
        acc.carbs += e.carbs;
        acc.fat += e.fat;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="space-y-10">
      {/* Mode Toggle */}
      <div className="flex bg-stone-100 rounded-2xl p-1">
        {[
          { id: "manual", label: "Manual", icon: "edit_note" },
          { id: "scan", label: "AI Scan", icon: "photo_camera" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id);
              setEntries([{ ...EMPTY_ENTRY }]);
              setPreviewUrl(null);
              setAiConfidence(null);
              setError("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              mode === m.id
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <span className="material-symbols-outlined text-base">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* AI Scan Upload (only in scan mode) */}
      {mode === "scan" && (
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
            className="w-full relative aspect-[4/3] max-w-[280px] mx-auto block rounded-[2rem] overflow-hidden shadow-xl group"
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
            <p className="text-center text-xs text-stone-400 mt-2 animate-pulse">Analyzing with AI...</p>
          )}
          {aiConfidence !== null && !scanning && (
            <p className="text-center text-xs text-lime-600 font-bold mt-2">AI Confidence: {aiConfidence}%</p>
          )}
        </div>
      )}

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
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black tracking-[0.15em] uppercase text-stone-400">
            {mode === "manual" ? "Pilih Makanan" : "Hasil Scan"}
          </h4>
          <button
            type="button"
            onClick={addEntry}
            className="text-primary text-[10px] font-black tracking-widest flex items-center gap-1 uppercase hover:opacity-70 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span> Tambah
          </button>
        </div>

        <div className="divide-y divide-stone-50 bg-white rounded-[1.5rem] border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          {entries.map((entry, idx) => (
            <div key={idx} className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                {mode === "manual" ? (
                  <button
                    type="button"
                    onClick={() => openPicker(idx)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-lime-50 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-lime-700 text-sm">restaurant</span>
                    </div>
                    <span className={`font-bold text-sm truncate ${entry.name ? "text-stone-900" : "text-stone-300"}`}>
                      {entry.name || "Pilih makanan..."}
                    </span>
                    <span className="material-symbols-outlined text-stone-300 text-sm flex-shrink-0">expand_more</span>
                  </button>
                ) : (
                  <input
                    type="text"
                    placeholder="Nama makanan..."
                    value={entry.name}
                    onChange={(e) => updateEntry(idx, "name", e.target.value)}
                    className="font-bold text-sm text-stone-900 bg-transparent border-none focus:outline-none flex-1 placeholder-stone-300"
                  />
                )}
                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(idx)}
                    className="text-stone-300 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>

              {/* Weight input for manual mode */}
              {mode === "manual" && entry.name && (
                <div className="flex items-center gap-3 bg-stone-50 rounded-xl px-3 py-2">
                  <span className="material-symbols-outlined text-stone-400 text-sm">scale</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={entry.weightGrams}
                    onChange={(e) => updateEntry(idx, "weightGrams", e.target.value)}
                    className="w-20 text-sm font-bold text-stone-900 bg-transparent border-none focus:outline-none text-center"
                  />
                  <span className="text-xs text-stone-400 font-bold">gram</span>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { field: "calories", label: "Kcal", color: "text-primary" },
                  { field: "protein", label: "Prot (g)" },
                  { field: "carbs", label: "Carb (g)" },
                  { field: "fat", label: "Fat (g)" },
                ].map(({ field, label, color }) => (
                  <div key={field} className="bg-stone-50 rounded-xl p-2 text-center">
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter mb-1">{label}</p>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={entry[field]}
                      onChange={(e) => updateEntry(idx, field, e.target.value)}
                      placeholder="0"
                      readOnly={mode === "manual" && !!entry._foodRef}
                      className={`w-full text-center bg-transparent border-none focus:outline-none font-black text-base ${color || ""} placeholder-stone-300 ${
                        mode === "manual" && entry._foodRef ? "cursor-default" : ""
                      }`}
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
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Total</p>
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

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">{error}</p>}

      {success && (
        <div className="flex items-center gap-3 bg-lime-50 rounded-xl px-4 py-3">
          <span className="material-symbols-outlined text-lime-700">check_circle</span>
          <p className="text-sm font-bold text-lime-800">Tersimpan!</p>
        </div>
      )}

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || scanning}
        className="w-full h-16 bg-stone-900 text-white rounded-[1.25rem] font-bold text-sm tracking-[0.1em] uppercase flex items-center justify-center gap-3 active:scale-95 transition-all border border-white/10 disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-lg">verified</span>
        {saving ? "Menyimpan..." : "Simpan"}
      </button>

      {/* ───────── TODAY'S FOOD LOG ───────── */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black tracking-[0.15em] uppercase text-stone-400">
            Log Hari Ini
          </h3>
          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400">
            <span className="material-symbols-outlined text-xs">today</span>
            {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>

        {/* Day summary bar */}
        <div className="bg-lime-50 border border-lime-100 rounded-2xl p-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Kalori", value: Math.round(dayTotals.calories), unit: "kcal", color: "text-lime-800" },
              { label: "Protein", value: Math.round(dayTotals.protein), unit: "g", color: "text-lime-800" },
              { label: "Karbo", value: Math.round(dayTotals.carbs), unit: "g", color: "text-lime-800" },
              { label: "Lemak", value: Math.round(dayTotals.fat), unit: "g", color: "text-lime-800" },
            ].map(({ label, value, unit, color }) => (
              <div key={label}>
                <p className={`text-lg font-black ${color}`}>{value}</p>
                <p className="text-[9px] text-lime-600 font-bold uppercase tracking-tighter">
                  {label} ({unit})
                </p>
              </div>
            ))}
          </div>
        </div>

        {todayLogs.length === 0 ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-4xl text-stone-200 mb-2 block">no_meals</span>
            <p className="text-sm text-stone-400">Belum ada log makanan hari ini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                  <div className="flex items-center gap-2">
                    {log.mealType && (
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full">
                        {MEAL_LABELS[log.mealType] || log.mealType}
                      </span>
                    )}
                    <span className="text-[10px] text-stone-400">
                      {new Date(log.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(log.id)}
                    disabled={deletingId === log.id}
                    className="text-stone-300 hover:text-red-400 transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {deletingId === log.id ? "hourglass_empty" : "delete"}
                    </span>
                  </button>
                </div>
                <div className="px-5 pb-4 space-y-2">
                  {log.entries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-lime-400 flex-shrink-0" />
                        <span className="text-sm font-semibold text-stone-800 truncate">{entry.name}</span>
                        <span className="text-[10px] text-stone-400 flex-shrink-0">{entry.weightGrams}g</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-stone-500 flex-shrink-0 ml-3">
                        <span className="font-bold text-primary">{Math.round(entry.calories)} kcal</span>
                        <span>P {Math.round(entry.protein)}</span>
                        <span>C {Math.round(entry.carbs)}</span>
                        <span>F {Math.round(entry.fat)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ───────── FOOD PICKER MODAL ───────── */}
      {showPicker && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPicker(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-[2rem] max-h-[80vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="p-5 border-b border-stone-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-stone-900">Pilih Makanan</h3>
                <button onClick={() => setShowPicker(false)} className="text-stone-400 hover:text-stone-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Cari makanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-stone-100 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
                {FOOD_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                      selectedCategory === cat
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Food List */}
            <div className="flex-1 overflow-y-auto p-3">
              {filteredFoods.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-stone-400">Tidak ditemukan.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredFoods.map((food, i) => (
                    <button
                      key={i}
                      onClick={() => selectFood(food)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-lime-50 active:bg-lime-100 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-stone-500 text-lg">lunch_dining</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-stone-900 truncate">{food.name}</p>
                        <p className="text-[10px] text-stone-400">
                          {food.calories} kcal &middot; P {food.protein}g &middot; C {food.carbs}g &middot; F {food.fat}g
                          <span className="text-stone-300 ml-1">/ 100g</span>
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-stone-300 uppercase tracking-wider flex-shrink-0">
                        {food.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
