/* eslint-disable @next/next/no-img-element */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";

function buildSvgPath(scans) {
  if (!scans || scans.length === 0) return null;
  const weights = scans.map((s) => s.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;
  const n = scans.length;

  const points = scans.map((s, i) => {
    const x = n > 1 ? (i / (n - 1)) * 400 : 200;
    const y = 90 - ((s.weight - minW) / range) * 80;
    return [x, y];
  });

  if (points.length === 1) {
    return `M${points[0][0]},${points[0][1]}`;
  }

  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const mx = (px + cx) / 2;
    d += ` C${mx},${py} ${mx},${cy} ${cx},${cy}`;
  }
  return { d, lastPoint: points[points.length - 1] };
}

function datLabel(date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function ProgressPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [user, profile, target, scans, allScans] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyTarget.findUnique({ where: { userId } }),
    prisma.bodyScanLog.findMany({
      where: { userId, date: { gte: sevenDaysAgo } },
      orderBy: { date: "asc" },
    }),
    prisma.bodyScanLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 10,
    }),
  ]);

  const latestScan = allScans[0];
  const prevScan = allScans[1];

  const weightDiff =
    latestScan && prevScan
      ? latestScan.weight - prevScan.weight
      : null;

  const muscleDiff =
    latestScan?.muscleMass && prevScan?.muscleMass
      ? latestScan.muscleMass - prevScan.muscleMass
      : null;

  const fatDiff =
    latestScan?.bodyFatPercent && prevScan?.bodyFatPercent
      ? latestScan.bodyFatPercent - prevScan.bodyFatPercent
      : null;

  const chartData = scans.length >= 2 ? buildSvgPath(scans) : null;
  const chartLabels =
    scans.length >= 2
      ? [
          datLabel(scans[0].date),
          datLabel(scans[Math.floor(scans.length / 2)].date),
          datLabel(scans[scans.length - 1].date),
        ]
      : ["Mon", "Wed", "Sun"];

  const goalWeight = profile?.goalWeight;
  const currentWeight = latestScan?.weight;
  const milestoneStartWeight = allScans.length > 0 ? allScans[allScans.length - 1].weight : null;
  let milestonePct = 0;
  let remainingKg = null;
  if (currentWeight && goalWeight && milestoneStartWeight) {
    const total = Math.abs(goalWeight - milestoneStartWeight);
    const done = Math.abs(currentWeight - milestoneStartWeight);
    milestonePct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 100;
    remainingKg = Math.abs(goalWeight - currentWeight).toFixed(1);
  }

  const avatarSrc =
    user?.avatarUrl ||
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=88c057&color=fff&bold=true`;

  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 shadow-[0_32px_32px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-100 border border-stone-200">
            <img alt="User Profile" className="w-full h-full object-cover" src={avatarSrc} />
          </div>
        </div>
        <h1 className="text-xl font-black text-stone-900 tracking-widest font-['Plus_Jakarta_Sans'] uppercase">
          VITALITY
        </h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-stone-900 hover:opacity-80 transition-opacity active:scale-95 duration-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <section className="space-y-1">
          <p className="font-label text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400">
            Your Evolution
          </p>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-stone-900">
            Progress
          </h2>
        </section>

        {/* Time Filter Chips — static for now */}
        <nav className="flex gap-2 p-1.5 bg-stone-100/80 rounded-2xl w-fit">
          <button className="px-6 py-2 rounded-xl bg-white text-stone-900 font-label text-xs font-bold tracking-wide shadow-sm transition-all active:scale-95">
            Weekly
          </button>
          <button className="px-6 py-2 rounded-xl text-stone-500 font-label text-xs font-bold tracking-wide hover:text-stone-900 transition-all active:scale-95">
            Monthly
          </button>
          <button className="px-6 py-2 rounded-xl text-stone-500 font-label text-xs font-bold tracking-wide hover:text-stone-900 transition-all active:scale-95">
            Annual
          </button>
        </nav>

        {/* Weight Chart */}
        <div className="bg-white rounded-[2rem] p-8 space-y-8 border border-stone-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-label text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400">
                Current Weight
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-5xl font-extrabold text-stone-900 tracking-tighter">
                  {latestScan?.weight?.toFixed(1) ?? "—"}
                </span>
                <span className="font-label text-sm font-semibold text-stone-400">KG</span>
              </div>
            </div>
            {weightDiff !== null && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${weightDiff >= 0 ? "text-primary bg-primary/5 border-primary/10" : "text-red-500 bg-red-50 border-red-100"}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {weightDiff >= 0 ? "arrow_upward" : "arrow_downward"}
                </span>
                <span>{weightDiff >= 0 ? "+" : ""}{weightDiff.toFixed(1)}kg</span>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="relative h-40 w-full">
            {chartData ? (
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#396a05" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#396a05" />
                  </linearGradient>
                </defs>
                <path
                  d={chartData.d}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
                <circle cx={chartData.lastPoint[0]} cy={chartData.lastPoint[1]} fill="#3a6a10" r="4" />
                <circle cx={chartData.lastPoint[0]} cy={chartData.lastPoint[1]} fill="white" r="2" />
              </svg>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-stone-400 text-sm">
                  {allScans.length === 0
                    ? "Belum ada scan. Lakukan body scan pertama."
                    : "Perlu ≥2 data dalam 7 hari untuk chart."}
                </p>
              </div>
            )}
            <div className="flex justify-between mt-2 font-label text-[9px] font-bold text-stone-300 uppercase tracking-[0.2em]">
              {chartLabels.map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-stone-100 rounded-3xl p-6 space-y-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  fitness_center
                </span>
              </div>
              <span className="font-label text-[9px] font-bold text-stone-400 tracking-[0.2em] uppercase">
                Muscle
              </span>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-extrabold text-stone-900">
                {latestScan?.muscleMass?.toFixed(1) ?? "—"}
                {latestScan?.muscleMass && (
                  <span className="text-xs font-medium ml-0.5 text-stone-400">kg</span>
                )}
              </h3>
              {muscleDiff !== null && (
                <p className={`font-label text-[10px] font-bold mt-1.5 ${muscleDiff >= 0 ? "text-primary" : "text-red-500"}`}>
                  {muscleDiff >= 0 ? "+" : ""}{muscleDiff.toFixed(1)}kg
                </p>
              )}
            </div>
          </div>
          <div className="bg-white border border-stone-100 rounded-3xl p-6 space-y-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-stone-900 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  opacity
                </span>
              </div>
              <span className="font-label text-[9px] font-bold text-stone-400 tracking-[0.2em] uppercase">
                Fat
              </span>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-extrabold text-stone-900">
                {latestScan?.bodyFatPercent?.toFixed(1) ?? "—"}
                {latestScan?.bodyFatPercent && (
                  <span className="text-xs font-medium ml-0.5 text-stone-400">%</span>
                )}
              </h3>
              {fatDiff !== null && (
                <p className={`font-label text-[10px] font-bold mt-1.5 ${fatDiff <= 0 ? "text-primary" : "text-red-500"}`}>
                  {fatDiff >= 0 ? "+" : ""}{fatDiff.toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        {allScans.length > 0 && (
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="font-headline text-lg font-bold tracking-tight text-stone-900">
                Recent Scans
              </h3>
            </div>
            <div className="space-y-2">
              {allScans.slice(0, 5).map((scan) => (
                <div
                  key={scan.id}
                  className="bg-white rounded-2xl border border-stone-100 p-5 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
                >
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                      {datLabel(scan.date)}
                    </p>
                    <p className="text-lg font-extrabold text-stone-900 mt-0.5">
                      {scan.weight.toFixed(1)} kg
                    </p>
                  </div>
                  <div className="flex gap-4 text-right">
                    {scan.bodyFatPercent !== null && (
                      <div>
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">BF</p>
                        <p className="text-sm font-bold text-stone-700">{scan.bodyFatPercent.toFixed(1)}%</p>
                      </div>
                    )}
                    {scan.muscleMass !== null && (
                      <div>
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Muscle</p>
                        <p className="text-sm font-bold text-stone-700">{scan.muscleMass.toFixed(1)} kg</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Milestone */}
        {goalWeight && currentWeight ? (
          <div className="bg-primary/5 rounded-[2rem] p-8 space-y-6 border border-primary/5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                military_tech
              </span>
              <h3 className="font-headline text-lg font-bold tracking-tight text-stone-900">
                Next Milestone
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-label text-[11px] font-bold text-stone-400 tracking-wider uppercase">
                  Target Weight: {goalWeight}kg
                </span>
                <span className="font-label text-xs font-bold text-primary">{milestonePct}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200/50 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${milestonePct}%` }}></div>
              </div>
              {remainingKg && (
                <p className="font-label text-[11px] text-stone-500 leading-relaxed font-medium">
                  You are exactly{" "}
                  <span className="text-stone-900 font-bold">{remainingKg}kg</span> away from your
                  goal. Keep up the consistency!
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/5 text-center">
            <p className="text-stone-500 text-sm">
              Set your goal weight in{" "}
              <a href="/profile" className="text-primary font-bold underline">Profile</a>{" "}
              to track your milestone.
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
