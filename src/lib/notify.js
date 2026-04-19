import { prisma } from "@/lib/prisma";
import { messaging } from "@/lib/firebase-admin";

/**
 * Send a push notification to a user and store it in the DB.
 *
 * @param {Object} opts
 * @param {string} opts.userId
 * @param {string} opts.title
 * @param {string} opts.body
 * @param {"REMINDER_MEAL"|"REMINDER_SCAN"|"NUTRITION_GOAL"|"SYSTEM"} [opts.type="SYSTEM"]
 * @param {Object} [opts.data] - optional extra payload
 */
export async function sendNotification({ userId, title, body, type = "SYSTEM", data }) {
  const notification = await prisma.notification.create({
    data: { userId, type, title, body, data: data ?? undefined },
  });

  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  const staleIds = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await messaging.send({
          token: sub.fcmToken,
          notification: { title, body },
          data: { notificationId: notification.id, type, ...(data ?? {}) },
          webpush: { fcmOptions: { link: "/notifications" } },
        });
      } catch (err) {
        if (
          err.code === "messaging/registration-token-not-registered" ||
          err.code === "messaging/invalid-registration-token"
        ) {
          staleIds.push(sub.id);
        }
      }
    })
  );

  if (staleIds.length > 0) {
    await prisma.pushSubscription.deleteMany({ where: { id: { in: staleIds } } });
  }

  return notification;
}
