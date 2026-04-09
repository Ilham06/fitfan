/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function daysDiff(date) {
  const now = new Date();
  const diff = now - new Date(date);
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;
  const today = new Date();

  const [user, profile, target, latestScan, prevScan, todayFoodEntries] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyTarget.findUnique({ where: { userId } }),
    prisma.bodyScanLog.findFirst({ where: { userId }, orderBy: { date: "desc" } }),
    prisma.bodyScanLog.findFirst({
      where: { userId, date: { lt: startOfDay() } },
      orderBy: { date: "desc" },
    }),
    prisma.foodEntry.findMany({
      where: {
        foodLog: {
          userId,
          date: { gte: startOfDay(today), lte: endOfDay(today) },
        },
      },
    }),
  ]);

  const totalConsumed = todayFoodEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
      fiber: acc.fiber + (e.fiber ?? 0),
      omega3: acc.omega3 + (e.omega3 ?? 0),
      iron: acc.iron + (e.iron ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, omega3: 0, iron: 0 }
  );

  const calTarget = target?.calories ?? 3200;
  const proteinTarget = target?.protein ?? 185;
  const carbsTarget = target?.carbs ?? 420;
  const fatTarget = target?.fat ?? 80;
  const fiberTarget = target?.fiber ?? 35;

  const calRemaining = Math.max(0, calTarget - totalConsumed.calories);
  const proteinPct = Math.min(100, (totalConsumed.protein / proteinTarget) * 100);
  const carbsPct = Math.min(100, (totalConsumed.carbs / carbsTarget) * 100);
  const fatPct = Math.min(100, (totalConsumed.fat / fatTarget) * 100);

  const weightDiff =
    latestScan && prevScan
      ? (latestScan.weight - prevScan.weight).toFixed(1)
      : null;

  const scanDaysAgo = latestScan ? daysDiff(latestScan.date) : null;

  const avatarSrc =
    user?.avatarUrl ||
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=88c057&color=fff&bold=true`;

  return (
    <div className="bg-stone-50 text-stone-800 min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_32px_32px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center px-6 h-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-100">
              <img alt="User Profile" className="w-full h-full object-cover" src={avatarSrc} />
            </div>
            <span className="text-xl font-black text-stone-900 tracking-widest uppercase font-['Plus_Jakarta_Sans']">
              VITALITY
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <span className="material-symbols-outlined text-stone-500">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-12">
        {/* Hero: Nutrition Summary */}
        <section className="bg-white rounded-[2rem] p-8 ultra-soft-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="font-label text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400">
              Calories Remaining
            </p>
            <div className="w-10 h-10 rounded-full bg-lime-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-lime-700 text-lg">restaurant</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-6xl font-headline font-bold tracking-tight text-stone-900">
              {calRemaining.toLocaleString()}
            </span>
            <span className="text-lg font-headline font-medium text-stone-400 uppercase tracking-widest">
              kcal
            </span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Protein", value: `${Math.round(totalConsumed.protein)}g`, pct: proteinPct, color: "bg-lime-500" },
              { label: "Carbs", value: `${Math.round(totalConsumed.carbs)}g`, pct: carbsPct, color: "bg-amber-400" },
              { label: "Fats", value: `${Math.round(totalConsumed.fat)}g`, pct: fatPct, color: "bg-stone-800" },
            ].map(({ label, value, pct, color }) => (
              <div key={label} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-label text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                    {label}
                  </span>
                  <span className="font-headline font-bold text-sm text-stone-900">{value}</span>
                </div>
                <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                  <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4">
          <Link
            href="/scan"
            className="flex flex-col items-center gap-3 bg-white py-6 rounded-[2rem] ultra-soft-shadow active:scale-95 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 group-hover:bg-lime-100 transition-colors">
              <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
            </div>
            <span className="font-headline font-bold text-[11px] uppercase tracking-widest text-stone-600">
              Scan Food
            </span>
          </Link>
          <Link
            href="/scan/body"
            className="flex flex-col items-center gap-3 bg-white py-6 rounded-[2rem] ultra-soft-shadow active:scale-95 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 group-hover:bg-lime-100 transition-colors">
              <span className="material-symbols-outlined text-2xl">accessibility_new</span>
            </div>
            <span className="font-headline font-bold text-[11px] uppercase tracking-widest text-stone-600">
              Scan Body
            </span>
          </Link>
        </section>

        {/* Body Stats */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-sm font-headline font-extrabold text-stone-900 uppercase tracking-[0.2em]">
              Body Composition
            </h2>
            <span className="text-[9px] font-label font-bold text-stone-400 tracking-widest uppercase">
              {scanDaysAgo !== null
                ? scanDaysAgo === 0
                  ? "Last Scan: Today"
                  : `Last Scan: ${scanDaysAgo}d ago`
                : "No scan yet"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-[2rem] p-6 ultra-soft-shadow border border-stone-50">
              <span className="font-label text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Weight
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-headline font-bold text-stone-900">
                  {latestScan?.weight?.toFixed(1) ?? "—"}
                </span>
                {latestScan?.weight && (
                  <span className="text-xs font-medium text-stone-400 uppercase">kg</span>
                )}
              </div>
              {weightDiff !== null && (
                <div className={`mt-4 flex items-center text-[10px] font-bold tracking-tight ${parseFloat(weightDiff) >= 0 ? "text-lime-700" : "text-red-500"}`}>
                  <span className="material-symbols-outlined text-sm mr-1">
                    {parseFloat(weightDiff) >= 0 ? "trending_up" : "trending_down"}
                  </span>
                  {parseFloat(weightDiff) >= 0 ? "+" : ""}{weightDiff}kg this week
                </div>
              )}
            </div>
            <div className="bg-white rounded-[2rem] p-6 ultra-soft-shadow border border-stone-50">
              <span className="font-label text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Body Fat
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-headline font-bold text-stone-900">
                  {latestScan?.bodyFatPercent?.toFixed(1) ?? "—"}
                </span>
                {latestScan?.bodyFatPercent && (
                  <span className="text-xs font-medium text-stone-400 uppercase">%</span>
                )}
              </div>
              <div className="mt-4 flex items-center text-[10px] font-bold text-stone-400 tracking-tight">
                <span className="material-symbols-outlined text-sm mr-1">horizontal_rule</span>
                Stable
              </div>
            </div>
            <div className="col-span-2 bg-white rounded-[2rem] p-6 ultra-soft-shadow border border-stone-50 flex items-center justify-between">
              <div>
                <span className="font-label text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Muscle Mass
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-headline font-bold text-stone-900">
                    {latestScan?.muscleMass?.toFixed(1) ?? "—"}
                  </span>
                  {latestScan?.muscleMass && (
                    <span className="text-xs font-medium text-stone-400 uppercase">kg</span>
                  )}
                </div>
              </div>
              <div className="h-16 w-32 grayscale opacity-30">
                <span className="material-symbols-outlined text-[64px] text-stone-400">self_improvement</span>
              </div>
            </div>
          </div>
        </section>

        {/* Workout Recommendation Card */}
        <section className="bg-stone-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <span className="inline-block border border-stone-700 px-3 py-1 rounded-full text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-4">
              Daily Focus
            </span>
            <h3 className="text-3xl font-headline font-bold text-white leading-tight">
              Hypertrophy
              <br />
              Leg Day
            </h3>
            <p className="text-sm text-stone-400 mt-4 leading-relaxed max-w-[80%]">
              Recovery level 92%. Optimized volume based on biometric trends.
            </p>
            <button className="mt-8 flex items-center gap-2 text-lime-400 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
              Details
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="absolute right-[-10%] bottom-[-10%] opacity-10">
            <span className="material-symbols-outlined text-[160px] text-white">fitness_center</span>
          </div>
        </section>

        {/* Nutrient Density */}
        <section className="space-y-6">
          <h2 className="text-sm font-headline font-extrabold text-stone-900 uppercase tracking-[0.2em] px-2">
            Nutrient Density
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            <div className="flex-shrink-0 w-36 h-36 rounded-full border border-stone-100 bg-white flex flex-col items-center justify-center text-center p-4 ultra-soft-shadow">
              <span className="font-label text-[9px] font-bold uppercase text-stone-400 tracking-widest mb-1">
                Fiber
              </span>
              <span className="text-xl font-headline font-bold text-stone-900">
                {totalConsumed.fiber > 0 ? `${Math.round(totalConsumed.fiber)}g` : "—"}
              </span>
              <span className="text-[8px] text-stone-400 mt-1 uppercase tracking-tighter">
                Goal: {fiberTarget}g
              </span>
            </div>
            <div className="flex-shrink-0 w-44 h-44 rounded-full bg-lime-50 border border-lime-100 flex flex-col items-center justify-center text-center p-6 ultra-soft-shadow">
              <span className="font-label text-[9px] font-bold uppercase text-lime-700 tracking-widest mb-1">
                Omega-3
              </span>
              <span className="text-2xl font-headline font-bold text-lime-900">
                {totalConsumed.omega3 > 0.1 ? `${totalConsumed.omega3.toFixed(1)}g` : "—"}
              </span>
              <span className="text-[8px] text-lime-600/60 mt-1 font-medium uppercase">
                Today
              </span>
            </div>
            <div className="flex-shrink-0 w-36 h-36 rounded-full border border-stone-100 bg-white flex flex-col items-center justify-center text-center p-4 ultra-soft-shadow">
              <span className="font-label text-[9px] font-bold uppercase text-stone-400 tracking-widest mb-1">
                Iron
              </span>
              <span className="text-xl font-headline font-bold text-stone-900">
                {totalConsumed.iron > 0 ? `${Math.round(totalConsumed.iron)}mg` : "—"}
              </span>
              <span className="text-[8px] text-stone-400 mt-1 uppercase">Daily Value</span>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
