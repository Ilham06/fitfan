"use client";

import { useState, useEffect, useCallback } from "react";

export default function usePushNotification() {
  const [permission, setPermission] = useState("default");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      return { error: "Push notifications not supported" };
    }

    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setLoading(false);
        return { error: "Permission denied" };
      }

      const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      await navigator.serviceWorker.ready;

      // Pass firebase config to service worker
      if (reg.active) {
        reg.active.postMessage({
          type: "FIREBASE_CONFIG",
          config: {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          },
        });
      }

      const { getMessaging, getToken: getFCMToken } = await import("firebase/messaging");
      const { app } = await import("@/lib/firebase");

      const messaging = getMessaging(app);
      const fcmToken = await getFCMToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: reg,
      });

      if (fcmToken) {
        await fetch("/api/notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: fcmToken }),
        });
        setToken(fcmToken);
        setLoading(false);
        return { token: fcmToken };
      }

      setLoading(false);
      return { error: "Failed to get FCM token" };
    } catch (err) {
      setLoading(false);
      return { error: err.message };
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setToken(null);
    } catch {
      // ignore
    }
    setLoading(false);
  }, [token]);

  return { permission, token, loading, subscribe, unsubscribe, isSubscribed: !!token };
}
