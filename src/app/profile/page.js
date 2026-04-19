/* eslint-disable @next/next/no-img-element */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import SignOutButton from "./SignOutButton";
import EditDailyTargets from "./EditDailyTargets";
import EditProfileInfo from "./EditProfileInfo";

const PHASE_LABELS = {
  LEAN_BULKING: "Lean Bulking",
  BULKING: "Bulking",
  CUTTING: "Cutting",
  MAINTENANCE: "Maintenance",
};

const MEMBERSHIP_LABELS = {
  STANDARD: "Standard Member",
  GOLD: "Gold Member",
  PLATINUM: "Platinum Member",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  const [user, profile, target, latestScan] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyTarget.findUnique({ where: { userId } }),
    prisma.bodyScanLog.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    }),
  ]);

  const joinedYear = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;

  const currentWeight = latestScan?.weight ?? profile?.currentWeight;
  const goalWeight = profile?.goalWeight;
  const progressPct =
    currentWeight && goalWeight && profile?.height
      ? Math.min(100, Math.round((currentWeight / goalWeight) * 100))
      : 70;

  const PHASE_PROTEIN = {
    LEAN_BULKING: 2.0,
    BULKING: 1.8,
    CUTTING: 2.2,
    MAINTENANCE: 1.6,
  };
  const PHASE_CAL_PER_KG = {
    LEAN_BULKING: 38,
    BULKING: 40,
    CUTTING: 28,
    MAINTENANCE: 33,
  };

  const userWeight = profile?.currentWeight ?? 65;
  const userPhase = profile?.currentPhase ?? "LEAN_BULKING";
  const estimatedCal = Math.round(userWeight * PHASE_CAL_PER_KG[userPhase]);
  const estimatedProtein = Math.round(userWeight * PHASE_PROTEIN[userPhase]);
  const estimatedFat = Math.round(userWeight * 1.0);
  const estimatedCarbs = Math.max(100, Math.round((estimatedCal - estimatedProtein * 4 - estimatedFat * 9) / 4));

  const effectiveTarget = {
    calories: target?.calories ?? estimatedCal,
    protein: target?.protein ?? estimatedProtein,
    carbs: target?.carbs ?? estimatedCarbs,
    fat: target?.fat ?? estimatedFat,
    fiber: target?.fiber ?? 30,
  };

  const avatarSrc =
    user?.avatarUrl ||
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=88c057&color=fff&bold=true`;

  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_32px_32px_rgba(0,0,0,0.04)] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-100 ring-2 ring-lime-700/10">
            <img className="w-full h-full object-cover" alt="User profile" src={avatarSrc} />
          </div>
          <span className="text-xl font-black text-stone-900 tracking-widest uppercase">
            FITFAN
          </span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-stone-500 hover:opacity-80 transition-opacity active:scale-95 duration-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="pt-24 px-6 max-w-xl mx-auto space-y-12">
        {/* User Identity */}
        <section className="flex flex-col items-center text-center space-y-6 pt-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-lime-100 to-stone-50 border border-stone-200">
              <img
                className="w-full h-full rounded-full object-cover"
                alt={user?.name || "User"}
                src={avatarSrc}
              />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
              {user?.name || "—"}
            </h1>
            <p className="text-stone-500 font-medium tracking-wide">
              {MEMBERSHIP_LABELS[user?.membershipType] || "Member"}
              {joinedYear ? ` • Joined ${joinedYear}` : ""}
            </p>
          </div>
        </section>

        {/* Goal Card */}
        <section className="lux-card p-8 rounded-[2.5rem] border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[0.65rem] font-bold text-stone-400 tracking-[0.2em] uppercase">
                Current Focus
              </span>
              <h2 className="text-2xl font-black text-stone-900">
                {PHASE_LABELS[profile?.currentPhase] || "Lean Bulking"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-lime-50 text-lime-700 text-[0.6rem] font-black rounded-full tracking-widest uppercase">
                Active
              </div>
              <EditProfileInfo
                currentPhase={profile?.currentPhase ?? "LEAN_BULKING"}
                height={profile?.height ?? null}
                goalWeight={profile?.goalWeight ?? null}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-lime-700">
                  {currentWeight?.toFixed(1) ?? "—"}
                </span>
                <span className="text-sm font-bold text-stone-400">kg</span>
              </div>
              <span className="text-xs font-bold text-stone-400 tracking-wider">
                Goal: {goalWeight ? `${goalWeight.toFixed(1)} kg` : "—"}
              </span>
            </div>
            <div className="relative w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-lime-700 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-3 gap-8 px-2">
          {[
            { label: "Tinggi", value: profile?.height ? `${profile.height}` : "—", unit: profile?.height ? "cm" : "" },
            { label: "Body Fat", value: latestScan?.bodyFatPercent ? `${latestScan.bodyFatPercent.toFixed(1)}` : "—", unit: latestScan?.bodyFatPercent ? "%" : "" },
            { label: "Streak", value: `${profile?.streak ?? 0}`, unit: "hari" },
          ].map(({ label, value, unit }) => (
            <div key={label} className="text-center space-y-1">
              <span className="text-[0.6rem] font-bold text-stone-400 tracking-[0.15em] uppercase">
                {label}
              </span>
              <p className="text-xl font-bold text-stone-900">
                {value}
                {unit && <span className="text-[10px] text-stone-400 ml-0.5">{unit}</span>}
              </p>
            </div>
          ))}
        </section>

        {/* Daily Targets */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">Daily Targets</h3>
              {!target && (
                <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                  Estimasi dari BB {userWeight}kg &middot; {PHASE_LABELS[userPhase]}
                </p>
              )}
            </div>
            <EditDailyTargets target={target} estimatedTarget={effectiveTarget} />
          </div>
          <div className="space-y-4">
            <div className="lux-card p-6 rounded-2xl border border-stone-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-900">
                  <span className="material-symbols-outlined">local_fire_department</span>
                </div>
                <span className="font-bold text-stone-900">Kalori</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-stone-900">
                  {effectiveTarget.calories.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-stone-400 uppercase ml-0.5 tracking-tighter">
                  kcal
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Protein", value: Math.round(effectiveTarget.protein), unit: "g", color: "bg-sky-500" },
                { label: "Karbo", value: Math.round(effectiveTarget.carbs), unit: "g", color: "bg-amber-400" },
                { label: "Lemak", value: Math.round(effectiveTarget.fat), unit: "g", color: "bg-rose-400" },
                { label: "Serat", value: Math.round(effectiveTarget.fiber), unit: "g", color: "bg-emerald-500" },
              ].map(({ label, value, unit, color }) => (
                <div key={label} className="lux-card p-6 rounded-2xl border border-stone-100 space-y-3">
                  <span className="text-[0.6rem] font-bold text-stone-400 tracking-[0.15em] uppercase">
                    {label}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-stone-900">
                      {value}
                    </span>
                    <span className="text-xs font-bold text-stone-400">{unit}</span>
                  </div>
                  <div className="w-full bg-stone-50 h-1 rounded-full overflow-hidden">
                    <div className={`${color} h-full rounded-full`} style={{ width: "100%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-6 pb-8">
          <h3 className="text-xl font-extrabold tracking-tight px-2">Preferences</h3>
          <div className="space-y-1">
            {[
              { icon: "account_circle", label: "Account" },
              { icon: "fitness_center", label: "Workout Plan" },
              { icon: "lock", label: "Security" },
            ].map(({ icon, label }) => (
              <a
                key={label}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-white transition-colors group"
                href="#"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-500 shadow-sm">
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </div>
                  <span className="font-bold text-stone-700">{label}</span>
                </div>
                <span className="material-symbols-outlined text-stone-300 group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </a>
            ))}
            <SignOutButton />
          </div>
        </section>

        <footer className="pt-8 pb-12 text-center opacity-20 select-none">
          <span className="text-[0.55rem] font-black tracking-[0.5em] uppercase">
            FITFAN LUXE EDITION
          </span>
        </footer>
      </main>

      <BottomNav />
    </div>
  );
}
