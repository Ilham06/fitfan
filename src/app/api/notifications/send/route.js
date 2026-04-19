import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { messaging } from "@/lib/firebase-admin";

export async function POST(req) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, title, body, type = "SYSTEM", data } = await req.json();

  const targetUserId = userId || session.user.id;

  const notification = await prisma.notification.create({
    data: {
      userId: targetUserId,
      type,
      title,
      body,
      data: data ?? undefined,
    },
  });

  const subs = await prisma.pushSubscription.findMany({
    where: { userId: targetUserId },
  });

  const results = { sent: 0, failed: 0 };

  for (const sub of subs) {
    try {
      await messaging.send({
        token: sub.fcmToken,
        notification: { title, body },
        data: {
          notificationId: notification.id,
          type,
          ...(data ?? {}),
        },
        webpush: {
          fcmOptions: { link: "/notifications" },
        },
      });
      results.sent++;
    } catch (err) {
      results.failed++;
      if (
        err.code === "messaging/registration-token-not-registered" ||
        err.code === "messaging/invalid-registration-token"
      ) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } });
      }
    }
  }

  return Response.json({ notification, ...results });
}
