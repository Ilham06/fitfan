"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/progress", icon: "insights", label: "Progress" },
  { href: "/scan", icon: "qr_code_scanner", label: "Scan" },
  { href: "/ai", icon: "smart_toy", label: "AI" },
  { href: "/profile", icon: "person", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 h-24 bg-white/80 backdrop-blur-xl z-50 rounded-t-[3rem] shadow-[0_-8px_32px_rgba(0,0,0,0.04)]">
      {NAV_ITEMS.map(({ href, icon, label }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all active:scale-90 duration-200 ease-out ${
              active
                ? "bg-lime-100 text-lime-800"
                : "text-stone-500 hover:bg-stone-100"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={
                active
                  ? {
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }
                  : undefined
              }
            >
              {icon}
            </span>
            <span className="font-['Inter'] text-[10px] font-bold tracking-[0.05em] uppercase mt-1">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
