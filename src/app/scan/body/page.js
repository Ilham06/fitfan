/* eslint-disable @next/next/no-img-element */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BottomNav from "@/components/BottomNav";
import BodyScanForm from "./BodyScanForm";

export default async function BodyScanPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  const [user, latestScan] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.bodyScanLog.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    }),
  ]);

  const avatarSrc =
    user?.avatarUrl ||
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=88c057&color=fff&bold=true`;

  return (
    <div className="bg-background text-on-surface min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_32px_32px_rgba(0,0,0,0.04)] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-100 shadow-sm">
            <img className="w-full h-full object-cover" alt="User Profile" src={avatarSrc} />
          </div>
          <span className="text-xl font-black text-stone-900 tracking-widest font-['Plus_Jakarta_Sans'] uppercase">
            FITFAN
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <span className="material-symbols-outlined text-stone-500">notifications</span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-lg mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
            Body Scan
          </h1>
          <p className="text-on-surface-variant leading-relaxed">
            Upload a photo of your smart scale or gym receipt to update your metrics instantly.
          </p>
        </div>

        {/* Extracted Metrics Form (includes OCR camera upload) */}
        <section className="space-y-6">
          <BodyScanForm latestScan={latestScan} />
        </section>

        {/* Tip Card */}
        <section className="mt-10 mb-16">
          <div className="bg-stone-900 p-8 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Consistency is Key</h3>
              <p className="text-sm text-stone-400 leading-relaxed mb-6">
                Try to weigh yourself at the same time each morning for the most accurate trend
                tracking.
              </p>
              <div className="inline-flex items-center gap-2 bg-stone-800 border border-stone-700/50 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-lime-400">
                <span className="material-symbols-outlined text-sm">lightbulb</span>
                Pro Bulking Tip
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-lime-400/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
