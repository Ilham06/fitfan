/* eslint-disable @next/next/no-img-element */
import BottomNav from "@/components/BottomNav";

export default function BodyScanPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_32px_32px_rgba(0,0,0,0.04)] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-100 shadow-sm">
            <img
              className="w-full h-full object-cover"
              alt="User Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC541mkqTHz-MR5ZmIocLlzGKIKtpPmjs7ehIhCL1JXFq_5DtEHgdzE2bTjs_GRreETPiFYCXsTrmd74anWAp0X96CBOwf7ndSzZS2QQhHkeRKks0QXvfWdUK4l7CSGfBmVQAgBug-Iqs9ME7W-3-xg80WyST9Y6OJmKnU-Ew0a2qr0V4ILmPY5BtQQKsmu1AQKJjzX5pY8IclT57GIzUN9bZwPpxTwd4fBKZU6t-4yA5KbZ7eOr0HXHjpRj6x-m3ryHCpdyNr-lZ6"
            />
          </div>
          <span className="text-xl font-black text-stone-900 tracking-widest font-['Plus_Jakarta_Sans'] uppercase">
            VITALITY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <span className="material-symbols-outlined text-stone-500">
              notifications
            </span>
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
            Upload a photo of your smart scale or gym receipt to update your
            metrics instantly.
          </p>
        </div>

        {/* Camera / Upload Section */}
        <section className="mb-10">
          <div className="relative group">
            <div className="aspect-[4/3] w-full rounded-2xl bg-white border border-stone-200/60 shadow-sm flex flex-col items-center justify-center overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale brightness-110"
                alt="Scale background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFldkW-qkyyiRo4mL4FE_RxXFYebuo_FDO7RVrPHVvYtTHblZtMyGZWqLNZstxpFcj-mjnkmQIFfWPRQPIkEyjtDWPux8W7_BQ0bVYJnR9lNjWNUTulys_bD4FkgBzricxsf0CxD1zdJvRSKUvr6-LQGtBRaTYlHwE_ipM3QK7nrGn5xDmDkZ4p8uVfyaTD50xnGMpdsuJSoMNFsipXzbbNMt-FpHwUE93rXD0hAFL0QaFyVxXEitJlYtvwbX7iz4nT00Effbgd6_8"
              />
              <div className="relative z-10 flex flex-col items-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-lime-100 flex items-center justify-center mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-lime-800 text-3xl">
                    qr_code_scanner
                  </span>
                </div>
                <p className="font-bold text-lg text-stone-900 mb-1">
                  Scan Receipt
                </p>
                <p className="text-xs text-stone-500 max-w-[200px] leading-relaxed">
                  Center the scale display or printed receipt in the frame
                </p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/5 backdrop-blur-[2px] rounded-2xl cursor-pointer">
              <button className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-lg">
                  upload
                </span>
                Take Photo
              </button>
            </div>
          </div>
        </section>

        {/* Extracted Metrics */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-stone-900">
              Extracted Metrics
            </h2>
            <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-stone-100 text-stone-500 px-3 py-1.5 rounded-full border border-stone-200/50">
              AI Verified
            </span>
          </div>

          {/* Metric Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Weight", value: "84.2", unit: "KG" },
              { label: "Body Fat", value: "14.5", unit: "%" },
              { label: "Muscle Mass", value: "68.8", unit: "KG" },
              { label: "BMI Index", value: "23.4", unit: "SCORE" },
            ].map(({ label, value, unit }) => (
              <div
                key={label}
                className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-stone-100 flex flex-col gap-1 transition-all hover:shadow-md"
              >
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {label}
                </label>
                <div className="flex items-baseline justify-between">
                  <input
                    className="w-full bg-transparent border-none p-0 text-2xl font-bold text-stone-900 focus:ring-0 focus:outline-none"
                    type="text"
                    defaultValue={value}
                  />
                  <span className="text-xs font-bold text-stone-400">
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Date Selection */}
          <div className="bg-stone-50 border border-stone-200/50 p-5 rounded-2xl flex items-center justify-between group cursor-pointer active:scale-[0.99] transition-transform">
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Entry Date
              </p>
              <p className="font-bold text-stone-900">Thursday, 24 Oct 2023</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-600 shadow-sm border border-stone-100 group-hover:text-lime-700 transition-colors">
              <span className="material-symbols-outlined text-xl">
                calendar_today
              </span>
            </div>
          </div>

          {/* Save CTA */}
          <button className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-stone-900/10 flex items-center justify-center gap-3 active:scale-[0.97] transition-all hover:bg-stone-800">
            <span className="material-symbols-outlined text-xl">save</span>
            Save Progress
          </button>
        </section>

        {/* Tip Card */}
        <section className="mt-10 mb-16">
          <div className="bg-stone-900 p-8 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Consistency is Key</h3>
              <p className="text-sm text-stone-400 leading-relaxed mb-6">
                Try to weigh yourself at the same time each morning for the most
                accurate trend tracking.
              </p>
              <div className="inline-flex items-center gap-2 bg-stone-800 border border-stone-700/50 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-lime-400">
                <span className="material-symbols-outlined text-sm">
                  lightbulb
                </span>
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
