"use client";

import { useState, useEffect, useCallback } from "react";
import BottomNav from "@/components/BottomNav";
import usePushNotification from "@/hooks/usePushNotification";

const TYPE_META = {
  REMINDER_MEAL: { icon: "restaurant", color: "bg-amber-50 text-amber-600" },
  REMINDER_SCAN: { icon: "monitor_weight", color: "bg-sky-50 text-sky-600" },
  NUTRITION_GOAL: { icon: "emoji_events", color: "bg-lime-50 text-lime-700" },
  SYSTEM: { icon: "info", color: "bg-stone-100 text-stone-600" },
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { permission, subscribe, loading: subLoading, isSubscribed } = usePushNotification();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markRead = async (id) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const showPermissionBanner = permission !== "granted";

  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen pb-32">
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-stone-100">
        <div className="flex justify-between items-center px-6 h-14">
          <h1 className="text-lg font-extrabold tracking-tight">Notifikasi</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-bold text-lime-700 uppercase tracking-wider"
            >
              Tandai semua dibaca
            </button>
          )}
        </div>
      </header>

      <main className="pt-16 px-4 max-w-2xl mx-auto">
        {/* Push Permission Banner */}
        {showPermissionBanner && (
          <div className="mx-2 mt-4 mb-2 bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-lime-50 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-lime-700">notifications_active</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-900">Aktifkan Push Notification</p>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                  Dapatkan pengingat makan, scan badan, dan update progres langsung di HP kamu.
                </p>
                <button
                  onClick={subscribe}
                  disabled={subLoading}
                  className="mt-3 px-5 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl uppercase tracking-wider hover:bg-stone-800 transition disabled:opacity-50"
                >
                  {subLoading ? "Mengaktifkan..." : "Aktifkan Notifikasi"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subscribed confirmation */}
        {isSubscribed && permission === "granted" && (
          <div className="mx-2 mt-4 mb-2 flex items-center gap-2 bg-lime-50 rounded-xl px-4 py-2.5">
            <span className="material-symbols-outlined text-lime-700 text-sm">check_circle</span>
            <p className="text-xs font-bold text-lime-800">Push notification aktif</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-stone-300">
                notifications_off
              </span>
            </div>
            <p className="text-sm font-bold text-stone-400">Belum ada notifikasi</p>
            <p className="text-xs text-stone-400 mt-1">
              Notifikasi pengingat dan update akan muncul di sini.
            </p>
          </div>
        )}

        {/* Notification List */}
        {!loading && notifications.length > 0 && (
          <div className="mt-2 space-y-1">
            {notifications.map((n) => {
              const meta = TYPE_META[n.type] || TYPE_META.SYSTEM;
              return (
                <button
                  key={n.id}
                  onClick={() => !n.read && markRead(n.id)}
                  className={`w-full flex items-start gap-3.5 p-4 rounded-2xl text-left transition-colors ${
                    n.read ? "opacity-60" : "bg-white shadow-sm"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                    <span className="material-symbols-outlined text-base">{meta.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-snug ${n.read ? "font-medium text-stone-600" : "font-bold text-stone-900"}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-lime-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-stone-400 mt-1.5 font-medium">{timeAgo(n.sentAt)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
