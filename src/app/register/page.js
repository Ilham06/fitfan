"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Password tidak cocok.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || "Gagal membuat akun. Coba lagi.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6 py-10">
      {/* Logo */}
      <div className="mb-10 text-center">
        <span className="text-3xl font-black text-stone-900 tracking-widest uppercase font-['Plus_Jakarta_Sans']">
          FITFAN
        </span>
        <p className="text-stone-500 text-sm mt-1">AI-Powered Bulking Tracker</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.06)] p-8">
        <h1 className="text-xl font-bold text-stone-900 mb-1">Buat Akun</h1>
        <p className="text-stone-500 text-sm mb-6">Mulai perjalanan bulking kamu</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 block">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Alex Gunawan"
              className="w-full border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@kamu.com"
              className="w-full border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 8 karakter"
              className="w-full border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 block">
              Konfirmasi Password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="••••••••"
              className="w-full border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold rounded-2xl py-3.5 text-sm hover:opacity-90 active:scale-95 transition disabled:opacity-60 mt-1"
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
