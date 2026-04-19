"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/progress", icon: "insights", label: "Progress" },
  { href: "/scan", icon: "qr_code_scanner", label: "Scan" },
  { href: "/notifications", icon: "notifications", label: "Notif" },
  { href: "/profile", icon: "person", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-end px-6 pb-5 pt-2.5 bg-white/90 backdrop-blur-xl z-50 border-t border-stone-100">
      {NAV_ITEMS.map(({ href, icon, label }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 py-1 transition-colors duration-150 ${
              active ? "text-stone-900" : "text-stone-400"
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{
                fontVariationSettings: active
                  ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
                  : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
              }}
            >
              {icon}
            </span>
            <span className="text-[9px] font-bold tracking-wider uppercase">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
