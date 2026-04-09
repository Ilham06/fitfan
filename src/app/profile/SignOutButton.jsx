"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50/50 transition-colors group mt-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-red-500 shadow-sm">
          <span className="material-symbols-outlined text-lg">logout</span>
        </div>
        <span className="font-bold text-red-500">Log Out</span>
      </div>
    </button>
  );
}
