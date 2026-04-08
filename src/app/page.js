/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function DashboardPage() {
  return (
    <div className="bg-stone-50 text-stone-800 min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_32px_32px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center px-6 h-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-100">
              <img
                alt="User Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj6liv6Trvk7TrKIEod_hrWe2a0Bg_6smWxODYWk0tefd_u3ZmVm51bB0D16xGqOv176h9qGXMHP8jdUoxMfBi-2ED8teJ8nYuD8AYYW6bfV-ZUWcG7kS3t8DN0I7u_8Z2gG5z2qeZzarwqEoLZREgm-Jq8APWFAVFHeewZkM01UV9Vc-V-adyjPC7lM9v2R4WqOo8qFYvJgbbu6PnOFIb-Ds38yVov2OpX87vCN99ewX3WbmLokji7TuEG"
              />
            </div>
            <span className="text-xl font-black text-stone-900 tracking-widest uppercase font-['Plus_Jakarta_Sans']">
              VITALITY
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <span className="material-symbols-outlined text-stone-500">
                notifications
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-12">
        {/* Hero: Nutrition Summary */}
        <section className="bg-white rounded-[2rem] p-8 ultra-soft-shadow">
          <div className="flex justify-between items-start mb-2">
            <p className="font-label text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400">
              Calories Remaining
            </p>
            <div className="w-10 h-10 rounded-full bg-lime-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-lime-700 text-lg">
                restaurant
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-6xl font-headline font-bold tracking-tight text-stone-900">
              1,420
            </span>
            <span className="text-lg font-headline font-medium text-stone-400 uppercase tracking-widest">
              kcal
            </span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-label text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                  Protein
                </span>
                <span className="font-headline font-bold text-sm text-stone-900">
                  142g
                </span>
              </div>
              <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                <div className="bg-lime-500 h-full w-3/4 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-label text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                  Carbs
                </span>
                <span className="font-headline font-bold text-sm text-stone-900">
                  210g
                </span>
              </div>
              <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-1/2 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-label text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                  Fats
                </span>
                <span className="font-headline font-bold text-sm text-stone-900">
                  48g
                </span>
              </div>
              <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                <div className="bg-stone-800 h-full w-2/3 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4">
          <Link
            href="/scan"
            className="flex flex-col items-center gap-3 bg-white py-6 rounded-[2rem] ultra-soft-shadow active:scale-95 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 group-hover:bg-lime-100 transition-colors">
              <span className="material-symbols-outlined text-2xl">
                qr_code_scanner
              </span>
            </div>
            <span className="font-headline font-bold text-[11px] uppercase tracking-widest text-stone-600">
              Scan Food
            </span>
          </Link>
          <Link
            href="/scan/body"
            className="flex flex-col items-center gap-3 bg-white py-6 rounded-[2rem] ultra-soft-shadow active:scale-95 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 group-hover:bg-lime-100 transition-colors">
              <span className="material-symbols-outlined text-2xl">
                accessibility_new
              </span>
            </div>
            <span className="font-headline font-bold text-[11px] uppercase tracking-widest text-stone-600">
              Scan Body
            </span>
          </Link>
        </section>

        {/* Body Stats */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-sm font-headline font-extrabold text-stone-900 uppercase tracking-[0.2em]">
              Body Composition
            </h2>
            <span className="text-[9px] font-label font-bold text-stone-400 tracking-widest uppercase">
              Last Scan: 2d ago
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-[2rem] p-6 ultra-soft-shadow border border-stone-50">
              <span className="font-label text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Weight
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-headline font-bold text-stone-900">
                  84.2
                </span>
                <span className="text-xs font-medium text-stone-400 uppercase">
                  kg
                </span>
              </div>
              <div className="mt-4 flex items-center text-[10px] font-bold text-lime-700 tracking-tight">
                <span className="material-symbols-outlined text-sm mr-1">
                  trending_up
                </span>
                +0.4kg this week
              </div>
            </div>
            <div className="bg-white rounded-[2rem] p-6 ultra-soft-shadow border border-stone-50">
              <span className="font-label text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Body Fat
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-headline font-bold text-stone-900">
                  14.2
                </span>
                <span className="text-xs font-medium text-stone-400 uppercase">
                  %
                </span>
              </div>
              <div className="mt-4 flex items-center text-[10px] font-bold text-stone-400 tracking-tight">
                <span className="material-symbols-outlined text-sm mr-1">
                  horizontal_rule
                </span>
                Stable
              </div>
            </div>
            <div className="col-span-2 bg-white rounded-[2rem] p-6 ultra-soft-shadow border border-stone-50 flex items-center justify-between">
              <div>
                <span className="font-label text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Muscle Mass
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-headline font-bold text-stone-900">
                    68.5
                  </span>
                  <span className="text-xs font-medium text-stone-400 uppercase">
                    kg
                  </span>
                </div>
              </div>
              <div className="h-16 w-32 grayscale opacity-30">
                <img
                  alt="Muscle representation"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLEiCs4ZxFQg9V9cSkG5W4OFRtUvB5mmnfRNn8Is9eiOF84GG4gEWW_mlQUtNX3qbwkLveRSnGx-ILOKjh1Hy77_q_RZbBAy944fGXUv0cUFt5r1cs_nIwA5YTbIa__AM3-E1uARxdNZaGIG2axeaF6Py-NgrX5VGEgNg1JGEs-Z2XGTHOs58gHLkhNU5yKOtJUXha5MFx8HgK5Rfosv7eMHpMORC7lKQo7RXjclrCfryT41yhnJesFSweqqjTNLoqNRTMPb-4MsjA"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Workout Recommendation Card */}
        <section className="bg-stone-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <span className="inline-block border border-stone-700 px-3 py-1 rounded-full text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-4">
              Daily Focus
            </span>
            <h3 className="text-3xl font-headline font-bold text-white leading-tight">
              Hypertrophy
              <br />
              Leg Day
            </h3>
            <p className="text-sm text-stone-400 mt-4 leading-relaxed max-w-[80%]">
              Recovery level 92%. Optimized volume based on biometric trends.
            </p>
            <button className="mt-8 flex items-center gap-2 text-lime-400 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
              Details
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>
          <div className="absolute right-[-10%] bottom-[-10%] opacity-10">
            <span className="material-symbols-outlined text-[160px] text-white">
              fitness_center
            </span>
          </div>
        </section>

        {/* Nutrient Density */}
        <section className="space-y-6">
          <h2 className="text-sm font-headline font-extrabold text-stone-900 uppercase tracking-[0.2em] px-2">
            Nutrient Density
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            <div className="flex-shrink-0 w-36 h-36 rounded-full border border-stone-100 bg-white flex flex-col items-center justify-center text-center p-4 ultra-soft-shadow">
              <span className="font-label text-[9px] font-bold uppercase text-stone-400 tracking-widest mb-1">
                Fiber
              </span>
              <span className="text-xl font-headline font-bold text-stone-900">
                28g
              </span>
              <span className="text-[8px] text-stone-400 mt-1 uppercase tracking-tighter">
                Goal: 35g
              </span>
            </div>
            <div className="flex-shrink-0 w-44 h-44 rounded-full bg-lime-50 border border-lime-100 flex flex-col items-center justify-center text-center p-6 ultra-soft-shadow">
              <span className="font-label text-[9px] font-bold uppercase text-lime-700 tracking-widest mb-1">
                Omega-3
              </span>
              <span className="text-2xl font-headline font-bold text-lime-900">
                High
              </span>
              <span className="text-[8px] text-lime-600/60 mt-1 font-medium uppercase">
                Salmon Source
              </span>
            </div>
            <div className="flex-shrink-0 w-36 h-36 rounded-full border border-stone-100 bg-white flex flex-col items-center justify-center text-center p-4 ultra-soft-shadow">
              <span className="font-label text-[9px] font-bold uppercase text-stone-400 tracking-widest mb-1">
                Iron
              </span>
              <span className="text-xl font-headline font-bold text-stone-900">
                12mg
              </span>
              <span className="text-[8px] text-stone-400 mt-1 uppercase">
                Daily Value
              </span>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
