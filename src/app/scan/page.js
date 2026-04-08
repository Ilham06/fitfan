/* eslint-disable @next/next/no-img-element */
import BottomNav from "@/components/BottomNav";

export default function FoodScanPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_32px_32px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center px-6 h-16 w-full">
          <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden ring-2 ring-stone-100/50">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_VJxA_KHULshyqFfXJtHePYIyvkD-GeVG8ZB7ktCzm4EzFy7M_1DZoxH15dEaaWFJm4y4_GSHHyrTPzlohp80LrOfgcCM93-RUa07ZtA0YEtgzvlGyDro9Hw3pp1VuUplkbwqQM6XSTkXCk0H3CPL45H4dkjkeng-_sQmcFZDMgxjzJUYxh2fPf-6sJcEGjKLJ-sHN7zHLud_gJeWQ6CLHK1VCfzwwZqYbsiKTuZHisFkM6dTKqg1t6WEYkzOmNz-F3eHqLZtns8-"
            />
          </div>
          <h1 className="text-xl font-black text-stone-900 tracking-widest uppercase font-['Plus_Jakarta_Sans']">
            VITALITY
          </h1>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-stone-500">
              notifications
            </span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-xl mx-auto space-y-10">
        {/* Scan Hero */}
        <section className="space-y-6 text-center">
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
              Food Scan
            </h2>
            <p className="text-on-surface-variant font-medium text-sm">
              AI-powered nutritional intelligence.
            </p>
          </div>
          <div className="relative aspect-square max-w-[320px] mx-auto group">
            <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] -rotate-3 scale-105 transition-transform group-hover:rotate-0"></div>
            <div className="relative h-full w-full rounded-[2.5rem] bg-stone-100 overflow-hidden shadow-2xl transition-all duration-700">
              <img
                alt="Scanned Food"
                className="w-full h-full object-cover opacity-90 scale-105 group-hover:scale-100 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrRDpZIqrznvnLRfYimo82ndysSNaZjMYxACCKhVipKASMQysSHRI0ThKTFLhS_7B2-UVU7Bw1St62pgdykCijDHHqbj8ya051-FF1W3lDiwcrsJl5xUZ6FAKxVasKHmq-1ayEnZQpzIOjX4_IQyVo9kR-CVy3IR5Kl5XjnK_QvMQpP8k-E_RupfPlh_N25Z-NgcSGpgKQdlgfxd848o9KjieK8M20zPtFqZihCzeRQsrlerYuXIoDPApGQiOTCBXo5_xDqos_Gjjp"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex flex-col items-center justify-end pb-8">
                <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all hover:bg-white/30">
                  <span className="material-symbols-outlined text-lg">
                    camera
                  </span>{" "}
                  Rescan
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Analysis Card */}
        <section className="bg-white rounded-[2rem] p-8 space-y-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-stone-100">
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
                <h3 className="text-xl font-extrabold tracking-tight">
                  AI Analysis
                </h3>
                <p className="text-[10px] text-lime-600 font-bold uppercase tracking-widest">
                  98% Precision
                </p>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Cals", value: "642", colored: true },
              { label: "Prot", value: "42g", colored: false },
              { label: "Carb", value: "28g", colored: false },
              { label: "Fat", value: "18g", colored: false },
            ].map(({ label, value, colored }) => (
              <div
                key={label}
                className="bg-stone-50 p-4 rounded-3xl text-center border border-stone-100/50"
              >
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter mb-1">
                  {label}
                </p>
                <p
                  className={`text-lg font-black ${colored ? "text-primary" : ""}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="text-[10px] font-black tracking-[0.15em] uppercase text-stone-400">
                Ingredients
              </h4>
              <button className="text-primary text-[10px] font-black tracking-widest flex items-center gap-1 uppercase hover:opacity-70 transition-opacity">
                <span className="material-symbols-outlined text-sm">
                  add_circle
                </span>{" "}
                Add
              </button>
            </div>
            <div className="divide-y divide-stone-50">
              {[
                { name: "Grilled Salmon", detail: "150g • 312 kcal", qty: "1x" },
                { name: "Avocado Slices", detail: "80g • 128 kcal", qty: "0.5x" },
                { name: "Quinoa & Kale", detail: "200g • 202 kcal", qty: "1x" },
              ].map(({ name, detail, qty }) => (
                <div
                  key={name}
                  className="flex items-center justify-between py-4 group"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm">{name}</p>
                    <p className="text-[10px] text-stone-400 font-medium tracking-wide uppercase">
                      {detail}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black bg-stone-50 px-3 py-1 rounded-full text-stone-500">
                      {qty}
                    </span>
                    <span className="material-symbols-outlined text-stone-300 hover:text-red-400 cursor-pointer text-sm transition-colors">
                      close
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="px-2">
          <button className="w-full h-16 bg-stone-900 text-white rounded-[1.25rem] font-bold text-sm tracking-[0.1em] uppercase flex items-center justify-center gap-3 active:scale-95 transition-all premium-shadow border border-white/10">
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            Save to Log
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
