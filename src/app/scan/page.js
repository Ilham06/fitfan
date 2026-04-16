/* eslint-disable @next/next/no-img-element */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import FoodLogForm from "./FoodLogForm";
import WeightProteinCard from "./WeightProteinCard";

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

export default async function FoodScanPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;
  const today = new Date();

  const [user, profile, dailyTarget, todayLogs] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyTarget.findUnique({ where: { userId } }),
    prisma.foodLog.findMany({
      where: {
        userId,
        date: { gte: startOfDay(today), lte: endOfDay(today) },
      },
      include: { entries: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const avatarSrc =
    user?.avatarUrl ||
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=88c057&color=fff&bold=true`;

  const serializedLogs = todayLogs.map((log) => ({
    id: log.id,
    mealType: log.mealType,
    createdAt: log.createdAt.toISOString(),
    entries: log.entries.map((e) => ({
      id: e.id,
      name: e.name,
      weightGrams: e.weightGrams,
      calories: e.calories,
      protein: e.protein,
      carbs: e.carbs,
      fat: e.fat,
    })),
  }));

  return (
    <div className="bg-background text-on-surface min-h-screen pb-32">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_32px_32px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center px-6 h-16 w-full">
          <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden ring-2 ring-stone-100/50">
            <img alt="Profile" className="w-full h-full object-cover" src={avatarSrc} />
          </div>
          <h1 className="text-xl font-black text-stone-900 tracking-widest uppercase font-['Plus_Jakarta_Sans']">
            FITFAN
          </h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-stone-500">notifications</span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-xl mx-auto space-y-10">
        <section className="space-y-2 text-center">
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
              Food Tracker
            </h2>
            <p className="text-on-surface-variant font-medium text-sm">
              Log makananmu — manual atau AI scan.
            </p>
          </div>
        </section>

        <WeightProteinCard
          currentWeight={profile?.currentWeight ?? null}
          currentPhase={profile?.currentPhase ?? "LEAN_BULKING"}
          currentProteinTarget={dailyTarget?.protein ?? null}
        />

        <section className="bg-white rounded-[2rem] p-8 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-stone-100">
          <div className="flex items-center gap-4">
            <div className="bg-lime-100 text-lime-800 p-2.5 rounded-2xl">
              <span
                className="material-symbols-outlined block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                restaurant
              </span>
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">Catat Makanan</h3>
              <p className="text-[10px] text-lime-600 font-bold uppercase tracking-widest">
                Manual &middot; AI Scan &middot; Auto Hitung
              </p>
            </div>
          </div>

          <FoodLogForm todayLogs={serializedLogs} />
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
