/* eslint-disable @next/next/no-img-element */
import BottomNav from "@/components/BottomNav";

export default function ProgressPage() {
  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 shadow-[0_32px_32px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-100 border border-stone-200">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnYA3nKn_PzEmvRSxLRwya-dlt4v2fMVWBU96Q_voribIU2uL68PMDrG2ePNDFoWMNeYyBbKBUrYf4YtiWbgM01GJM-gV6gtB4TdZfo-cIHzKCCrr0HIZvu962jU-jigqb9SmhEC_EiXRlGB6t-tOQrw9urPmRQvFVxAVbd1Uz6GM2Zj6Wn2p_h4eyIiAlwMgPh3vFR97nWrG9F-UQeFAglsb4H7RyQdrX2g0raa4nzPBQ53dIe2qCPPitIbq4dpcv5AA1RZzRumU0"
            />
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

        {/* Time Filter Chips */}
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
        <div className="bg-white rounded-[2rem] p-8 luxe-shadow space-y-8 border border-stone-100">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-label text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400">
                Current Weight
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-5xl font-extrabold text-stone-900 tracking-tighter">
                  82.4
                </span>
                <span className="font-label text-sm font-semibold text-stone-400">
                  KG
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-primary bg-primary-fixed/50 px-3 py-1 rounded-full border border-primary/10">
              <span className="material-symbols-outlined text-[14px]">
                arrow_upward
              </span>
              <span className="font-label text-[11px] font-bold">1.2%</span>
            </div>
          </div>
          {/* Chart */}
          <div className="relative h-40 w-full">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 400 100"
            >
              <path
                d="M0,70 C50,70 100,50 150,60 C200,70 250,30 300,40 C350,50 400,20 400,20"
                fill="none"
                stroke="#3a6a10"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
              <circle cx="400" cy="20" fill="#3a6a10" r="4" />
              <circle cx="400" cy="20" fill="white" r="2" />
            </svg>
            <div className="flex justify-between mt-4 font-label text-[9px] font-bold text-stone-300 uppercase tracking-[0.2em]">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-stone-100 rounded-3xl p-6 space-y-4 luxe-shadow">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-primary-fixed/30 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-primary text-sm"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  fitness_center
                </span>
              </div>
              <span className="font-label text-[9px] font-bold text-stone-400 tracking-[0.2em] uppercase">
                Muscle
              </span>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-extrabold text-stone-900">
                42.8
                <span className="text-xs font-medium ml-0.5 text-stone-400">
                  kg
                </span>
              </h3>
              <p className="font-label text-[10px] text-primary font-bold mt-1.5">
                +0.4%
              </p>
            </div>
          </div>
          <div className="bg-white border border-stone-100 rounded-3xl p-6 space-y-4 luxe-shadow">
            <div className="flex justify-between items-center">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-stone-900 text-sm"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  opacity
                </span>
              </div>
              <span className="font-label text-[9px] font-bold text-stone-400 tracking-[0.2em] uppercase">
                Fat
              </span>
            </div>
            <div>
              <h3 className="font-headline text-2xl font-extrabold text-stone-900">
                14.2
                <span className="text-xs font-medium ml-0.5 text-stone-400">
                  %
                </span>
              </h3>
              <p className="font-label text-[10px] text-stone-400 font-bold mt-1.5">
                -0.2%
              </p>
            </div>
          </div>
        </div>

        {/* Recent Snapshots */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="font-headline text-lg font-bold tracking-tight text-stone-900">
              Recent Snapshots
            </h3>
            <button className="text-primary font-label text-[10px] font-bold uppercase tracking-[0.15em]">
              Explore All
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6">
            {[
              { date: "OCT 24", weight: "82.4 kg", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmvfg4T6Nv4b3c39zHawLhqI1MDxPfO3s6x6K_I7ULwqRqeaFKe04Bpqx4RV6iXgGS3DtoHtbquAju5qBPkxTKVH5sy_HMKMn0ytmtL6G76E7txbkzHqsZtL7jGM3yH9Xz4axZvtnxtKMi4hVEFi5TMqq3tOLJR_1gRyJwj5XSwkWpAsgTycIVryzWfrvHf3GEBNnNptTyf9wjNj9HlfuJ7gOf_CknNpWrcFe0dvypoxA5RO0Vd7pstQD0Bg2C37LHwn3zk5pj9-Hy" },
              { date: "OCT 17", weight: "81.8 kg", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdDqCBAJRoP-nwWM3BnBIBMlt5E5An2i04ZVygvrQyu6VN1hWJMh37z822D4Z5gUTh3vzU_c8BfFq3gaHcmxyvNC4KqhDk63D-n37PJYjoBndxVqPVIzks7vsqVWBtmO5LyknBSaVbJpt8jJVtgx6zzcIQS7s4x-JJCewhEvoyIGRFjI-lU0_g_fveFmA_9Qhdd-pG4KiNhLD-uB1GeU_YxJRPEdhEeITsn0h2ZBUKLvcQ21X3ePdcExJawiTvNKthA6GE_jH384cp" },
              { date: "OCT 10", weight: "81.5 kg", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVfnxQulFFuaXt8Y_cVWLuIbwvMJDJ372DjHezCx_iCle2QCoHYB4kwId3bZIt7CqN9GlIzbruiwN4U_dcpSNEzLP0QWeV3OEaghMV9WK5Pev4-pY7hZx1thZb3APyWEJ2ZyUuFIhjKbh6cwZUbb2ErrvL2ZZ-omJU_xaxmqTbgar12IQHGlmNOl9b8DRjx5w5KVOuWd4ELtQQ2lFEIrgUfA0GozzTPztjNS-Vb47SdXWjwcfNtMNJ_-WJwKo2Gedq-JwxV8h3Fhd" },
            ].map(({ date, weight, src }) => (
              <div
                key={date}
                className="min-w-[140px] aspect-[4/5] rounded-3xl overflow-hidden relative group"
              >
                <img
                  alt={`Snapshot ${date}`}
                  className="w-full h-full object-cover"
                  src={src}
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-label text-[9px] font-bold tracking-widest uppercase opacity-80">
                    {date}
                  </p>
                  <p className="text-white font-headline font-bold text-sm">
                    {weight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Milestone */}
        <div className="bg-primary/5 rounded-[2rem] p-8 space-y-6 border border-primary/5">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              military_tech
            </span>
            <h3 className="font-headline text-lg font-bold tracking-tight text-stone-900">
              Next Milestone
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="font-label text-[11px] font-bold text-stone-400 tracking-wider uppercase">
                Target Weight: 85kg
              </span>
              <span className="font-label text-xs font-bold text-primary">
                65%
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[65%] rounded-full"></div>
            </div>
            <p className="font-label text-[11px] text-stone-500 leading-relaxed font-medium">
              You are exactly{" "}
              <span className="text-stone-900 font-bold">2.6kg</span> away from
              your goal. Maintaining your current pace will reach it in 3 weeks.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
