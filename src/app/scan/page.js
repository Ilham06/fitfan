/* eslint-disable @next/next/no-img-element */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import FoodLogForm from "./FoodLogForm";

export default async function FoodScanPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const avatarSrc =
    user?.avatarUrl ||
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=88c057&color=fff&bold=true`;

  return (
    <div className="bg-background text-on-surface min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_32px_32px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center px-6 h-16 w-full">
          <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden ring-2 ring-stone-100/50">
            <img alt="Profile" className="w-full h-full object-cover" src={avatarSrc} />
          </div>
          <h1 className="text-xl font-black text-stone-900 tracking-widest uppercase font-['Plus_Jakarta_Sans']">
            VITALITY
          </h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-stone-500">notifications</span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-xl mx-auto space-y-10">
        {/* Scan Hero */}
        <section className="space-y-2 text-center">
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
              Food Scan
            </h2>
            <p className="text-on-surface-variant font-medium text-sm">
              AI-powered nutritional intelligence.
            </p>
          </div>
        </section>

        {/* AI Analysis Card + Manual Form */}
        <section className="bg-white rounded-[2rem] p-8 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-lime-100 text-lime-800 p-2.5 rounded-2xl">
                <span
                  className="material-symbols-outlined block"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">Manual Entry</h3>
                <p className="text-[10px] text-lime-600 font-bold uppercase tracking-widest">
                  Log Food & Macros
                </p>
              </div>
            </div>
          </div>

          <FoodLogForm />
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
