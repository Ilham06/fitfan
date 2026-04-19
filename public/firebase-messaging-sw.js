/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/11.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.7.1/firebase-messaging-compat.js");

let messagingInstance = null;

self.addEventListener("message", (event) => {
  if (event.data?.type === "FIREBASE_CONFIG" && !messagingInstance) {
    firebase.initializeApp(event.data.config);
    messagingInstance = firebase.messaging();

    messagingInstance.onBackgroundMessage((payload) => {
      const { title, body, icon } = payload.notification || {};
      self.registration.showNotification(title || "FitFan", {
        body: body || "",
        icon: icon || "/icon-192.png",
        badge: "/icon-192.png",
        data: payload.data,
      });
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/notifications") && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow("/notifications");
    })
  );
});
