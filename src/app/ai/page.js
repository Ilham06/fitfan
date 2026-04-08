/* eslint-disable @next/next/no-img-element */
import BottomNav from "@/components/BottomNav";

export default function AIPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_32px_32px_rgba(0,0,0,0.04)] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-100">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD61LTiBZfP9-sXHJ6-Ru0EtM0gc6a6A9F0uMYYKSGjl4AE-UmC-VzAsWTUVsNjzs8qkVZdDqYvqrRYnT27MbSR49cbNVJfYbPyJ7SVngsImwgWuWgpezFuYX3eXuEzBWXinrgfbpAC8Yy9zrBF408jw_6cLVyIO4UQB21hi9ZmdEoJuwmrDxz3mEEKKPy4O6FqaQcBlVC36bV5sJHLZNA1nP3mJzurrTHtHtjrTVb5BWqf7aXOjZHfl6Rex7mRbAHM8hEvPkrO7LVo"
            />
          </div>
          <span className="text-xl font-black text-stone-900 tracking-widest font-headline uppercase">
            Vitality
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <span className="material-symbols-outlined text-stone-500">
              notifications
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-16 mb-40 px-6 max-w-2xl mx-auto w-full flex flex-col">
        {/* Header Context */}
        <section className="mb-10 mt-8 space-y-6">
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
                Vitality AI
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
              <p className="font-headline font-bold text-on-surface">
                Lean Bulking
              </p>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-stone-100">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.1em] mb-1 block">
                Daily Target
              </span>
              <p className="font-headline font-bold text-on-surface">
                3,200 kcal
              </p>
            </div>
          </div>
        </section>

        {/* Chat History */}
        <div className="flex-1 space-y-8 pb-10">
          {/* AI Message */}
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="bg-surface-container-low px-6 py-5 rounded-[2rem] rounded-bl-none border border-stone-50">
              <p className="text-on-surface/90 leading-relaxed text-sm">
                Good morning! Based on your 2,800 kcal intake yesterday and your
                6:00 AM weight of 178.4 lbs, I&apos;ve adjusted today&apos;s plan.
                <br />
                <br />
                Should we focus on a{" "}
                <span className="font-bold text-primary">
                  Post-Workout Meal
                </span>{" "}
                suggestion or look at your{" "}
                <span className="font-bold text-primary">Leg Day</span> routine
                adjustments?
              </p>
            </div>
            <span className="text-[9px] font-bold text-stone-400 mt-3 ml-2 uppercase tracking-widest">
              8:42 AM
            </span>
          </div>

          {/* User Message */}
          <div className="flex flex-col items-end max-w-[85%] ml-auto">
            <div className="bg-stone-900 text-white px-6 py-5 rounded-[2rem] rounded-br-none shadow-sm">
              <p className="leading-relaxed text-sm">
                Suggest a high-protein meal. I&apos;m traveling and only have
                access to a grocery store deli.
              </p>
            </div>
            <span className="text-[9px] font-bold text-stone-400 mt-3 mr-2 uppercase tracking-widest">
              8:45 AM
            </span>
          </div>

          {/* AI Message with Recommendation Card */}
          <div className="flex flex-col items-start w-full">
            <div className="bg-surface-container-low px-6 py-6 rounded-[2rem] rounded-bl-none border border-stone-50 w-[95%]">
              <p className="text-on-surface/90 leading-relaxed text-sm mb-6">
                Perfect. Here is a &quot;Vitality-Approved&quot; grocery deli haul for a
                quick bulking meal:
              </p>
              {/* Recommendation Card */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline font-extrabold text-stone-900 text-lg">
                      Rotisserie & Quinoa Bowl
                    </h3>
                    <p className="text-[11px] font-bold text-lime-700 uppercase tracking-widest mt-1">
                      750 kcal • 55g Protein
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-stone-300">
                    restaurant
                  </span>
                </div>
                <ul className="text-sm space-y-3 text-on-surface-variant">
                  {[
                    "1/2 Rotisserie Chicken (Skinless)",
                    "1 Pre-packaged Quinoa & Kale cup",
                    "1 Individual pack of Roasted Almonds",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-600 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-lime-700 text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-lime-800 transition-all active:scale-95">
                  Log Meal
                </button>
              </div>
            </div>
            <span className="text-[9px] font-bold text-stone-400 mt-3 ml-2 uppercase tracking-widest">
              8:46 AM
            </span>
          </div>
        </div>
      </main>

      {/* Input Bar */}
      <div className="fixed bottom-28 left-0 w-full px-6 z-40">
        <div className="max-w-2xl mx-auto bg-stone-50/90 backdrop-blur-2xl border border-stone-200/50 p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex items-center gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors">
            <span className="material-symbols-outlined">add</span>
          </button>
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium py-2 px-2 placeholder:text-stone-400"
            placeholder="Type a message..."
            type="text"
          />
          <button className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center transition-all active:scale-90 shadow-md">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              arrow_upward
            </span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
