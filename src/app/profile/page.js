/* eslint-disable @next/next/no-img-element */
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_32px_32px_rgba(0,0,0,0.04)] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-100 ring-2 ring-lime-700/10">
            <img
              className="w-full h-full object-cover"
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC22x3vKTaCibzGPWSdy6BaBdWaUosEPPpxMA3u3A5zQVPgk3lsu7S3_odwwyTI0loCwtmTmGF5mgGQ9Mf1lV6UfKja0pja5Qu5Y0H2nuKp7QeOJy4oW5S5_i0QFK_P1mhp_q_yLuQS1UrsehCQrZU1wK0CW36sSBsMHZzXYr3c6feetrvBHLkgLo5sl3rYaDBZ06dVj3cXLDmrRT6ejNOlL18MMxkPmk89KSctmVnrlrTIzSRqWlap2KsrqHZk9ew_RZ4e-gstJT0x"
            />
          </div>
          <span className="text-xl font-black text-stone-900 tracking-widest uppercase">
            VITALITY
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
                alt="Alex Rivers"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHSeS_IORx6uGsfm9g7IhHy7-iDFZ2W2bXzwOajYvlAEpgDgkVX4pkLPnvbabHoTFbYklxkXAI_-abC2QGCoGEvpVVi9theyjTlvAo6amMaMySKa2cS6qdztMSMwG49sIFGYiNsbUzjq2lkwSN9pAYNy5H9QiHJDZznvoibkJ2QFmWf8eZ3TvK3WiewjfK2ozjrEV3sLAUYQFe6PKumRXsWQ3a7tdpbah-agZ-WJvMX4qfFAej07nKZJaYDD_hDXeEkRZxS8t4v5K8"
              />
            </div>
            <button className="absolute bottom-1 right-1 bg-white text-stone-900 p-2 rounded-full shadow-lg border border-stone-100 hover:scale-110 transition-transform active:scale-95">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
              Alex Rivers
            </h1>
            <p className="text-stone-500 font-medium tracking-wide">
              Gold Member • Joined Jan 2024
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
                Lean Bulking
              </h2>
            </div>
            <div className="px-3 py-1 bg-lime-50 text-lime-700 text-[0.6rem] font-black rounded-full tracking-widest uppercase">
              Active
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-lime-700">82.5</span>
                <span className="text-sm font-bold text-stone-400">kg</span>
              </div>
              <span className="text-xs font-bold text-stone-400 tracking-wider">
                Goal: 85.0 kg
              </span>
            </div>
            <div className="relative w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-lime-700 rounded-full transition-all duration-1000 ease-out"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-3 gap-8 px-2">
          {[
            { label: "Height", value: "184", unit: "cm" },
            { label: "Body Fat", value: "14.2", unit: "%" },
            { label: "Streak", value: "18", unit: "days" },
          ].map(({ label, value, unit }) => (
            <div key={label} className="text-center space-y-1">
              <span className="text-[0.6rem] font-bold text-stone-400 tracking-[0.15em] uppercase">
                {label}
              </span>
              <p className="text-xl font-bold text-stone-900">
                {value}
                <span className="text-[10px] text-stone-400 ml-0.5">{unit}</span>
              </p>
            </div>
          ))}
        </section>

        {/* Daily Targets */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-extrabold tracking-tight">
              Daily Targets
            </h3>
            <button className="text-lime-700 font-bold text-xs flex items-center gap-1.5 uppercase tracking-widest">
              Edit{" "}
              <span className="material-symbols-outlined text-sm">
                settings_suggest
              </span>
            </button>
          </div>
          <div className="space-y-4">
            <div className="lux-card p-6 rounded-2xl border border-stone-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-900">
                  <span className="material-symbols-outlined">
                    local_fire_department
                  </span>
                </div>
                <span className="font-bold text-stone-900">Energy Intake</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-stone-900">3,200</span>
                <span className="text-[10px] font-bold text-stone-400 uppercase ml-0.5 tracking-tighter">
                  kcal
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="lux-card p-6 rounded-2xl border border-stone-100 space-y-3">
                <span className="text-[0.6rem] font-bold text-stone-400 tracking-[0.15em] uppercase">
                  Protein
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-stone-900">
                    185
                  </span>
                  <span className="text-xs font-bold text-stone-400">g</span>
                </div>
                <div className="w-full bg-stone-50 h-1 rounded-full overflow-hidden">
                  <div className="bg-lime-700 h-full w-[80%] rounded-full"></div>
                </div>
              </div>
              <div className="lux-card p-6 rounded-2xl border border-stone-100 space-y-3">
                <span className="text-[0.6rem] font-bold text-stone-400 tracking-[0.15em] uppercase">
                  Carbs
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-stone-900">
                    420
                  </span>
                  <span className="text-xs font-bold text-stone-400">g</span>
                </div>
                <div className="w-full bg-stone-50 h-1 rounded-full overflow-hidden">
                  <div className="bg-stone-300 h-full w-[65%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-6 pb-8">
          <h3 className="text-xl font-extrabold tracking-tight px-2">
            Preferences
          </h3>
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
                    <span className="material-symbols-outlined text-lg">
                      {icon}
                    </span>
                  </div>
                  <span className="font-bold text-stone-700">{label}</span>
                </div>
                <span className="material-symbols-outlined text-stone-300 group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </a>
            ))}
            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50/50 transition-colors group mt-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-red-500 shadow-sm">
                  <span className="material-symbols-outlined text-lg">
                    logout
                  </span>
                </div>
                <span className="font-bold text-red-500">Log Out</span>
              </div>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-12 text-center opacity-20 select-none">
          <span className="text-[0.55rem] font-black tracking-[0.5em] uppercase">
            VITALITY LUXE EDITION
          </span>
        </footer>
      </main>

      <BottomNav />
    </div>
  );
}
