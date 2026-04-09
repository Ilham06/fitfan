"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message || "Email atau password salah.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          className="w-full border border-stone-200 rounded-2xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white font-semibold rounded-2xl py-3.5 text-sm hover:opacity-90 active:scale-95 transition disabled:opacity-60 mt-1"
      >
        {loading ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
      <div className="mb-10 text-center">
        <span className="text-3xl font-black text-stone-900 tracking-widest uppercase font-['Plus_Jakarta_Sans']">
          VITALITY
        </span>
        <p className="text-stone-500 text-sm mt-1">AI-Powered Bulking Tracker</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.06)] p-8">
        <h1 className="text-xl font-bold text-stone-900 mb-1">Masuk</h1>
        <p className="text-stone-500 text-sm mb-6">Selamat datang kembali!</p>

        <Suspense fallback={<div className="h-48 animate-pulse bg-stone-50 rounded-2xl" />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-sm text-stone-500 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
