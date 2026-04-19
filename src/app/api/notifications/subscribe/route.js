import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await req.json();
  if (!token) return Response.json({ error: "Token required" }, { status: 400 });

  await prisma.pushSubscription.upsert({
    where: { fcmToken: token },
    update: { userId: session.user.id, updatedAt: new Date() },
    create: {
      userId: session.user.id,
      fcmToken: token,
      device: req.headers.get("user-agent")?.slice(0, 200) ?? null,
    },
  });

  return Response.json({ ok: true });
}
