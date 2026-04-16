/* eslint-disable @next/next/no-img-element */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import ChatInterface from "./ChatInterface";

const PHASE_LABELS = {
  LEAN_BULKING: "Lean Bulking",
  BULKING: "Bulking",
  CUTTING: "Cutting",
  MAINTENANCE: "Maintenance",
};

export default async function AIPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  const [user, profile, target] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyTarget.findUnique({ where: { userId } }),
  ]);

  const avatarSrc =
    user?.avatarUrl ||
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=88c057&color=fff&bold=true`;

  const phase = PHASE_LABELS[profile?.currentPhase] || "Lean Bulking";

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_32px_32px_rgba(0,0,0,0.04)] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-100">
            <img alt="User Profile" className="w-full h-full object-cover" src={avatarSrc} />
          </div>
          <span className="text-xl font-black text-stone-900 tracking-widest font-headline uppercase">
            FitFan
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <span className="material-symbols-outlined text-stone-500">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-16 mb-40 px-6 max-w-2xl mx-auto w-full flex flex-col">
        {/* Header Context */}
        <section className="mb-8 mt-8 space-y-6">
          <div className="bg-primary-container/40 p-8 rounded-lg flex items-center gap-5">
            <div className="bg-primary text-on-primary w-14 h-14 rounded-full flex items-center justify-center shadow-sm">
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                smart_toy
              </span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-on-primary-container text-xl tracking-tight">
                FitFan AI
              </h2>
              <p className="text-on-primary-container/60 text-sm">
                Personalized Nutrition Guide
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low p-5 rounded-xl border border-stone-100">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.1em] mb-1 block">
                Current Phase
              </span>
              <p className="font-headline font-bold text-on-surface">{phase}</p>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-stone-100">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.1em] mb-1 block">
                Daily Target
              </span>
              <p className="font-headline font-bold text-on-surface">
                {target?.calories?.toLocaleString() ?? "—"} kcal
              </p>
            </div>
          </div>
        </section>

        {/* Chat — Client Component */}
        <ChatInterface
          userName={user?.name || "there"}
          phase={phase}
          calorieTarget={target?.calories}
        />
      </main>

      <BottomNav />
    </div>
  );
}
