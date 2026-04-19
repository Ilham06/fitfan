"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session;
}

export async function updateProfile(formData) {
  const session = await getSession();
  const userId = session.user.id;

  const name = formData.get("name");
  const avatarUrl = formData.get("avatarUrl");
  const height = formData.get("height") ? parseFloat(formData.get("height")) : null;
  const goalWeight = formData.get("goalWeight") ? parseFloat(formData.get("goalWeight")) : null;
  const currentPhase = formData.get("currentPhase");

  await prisma.user.update({
    where: { id: userId },
    data: { name, avatarUrl: avatarUrl || null },
  });

  await prisma.userProfile.upsert({
    where: { userId },
    update: { height, goalWeight, currentPhase: currentPhase || "LEAN_BULKING" },
    create: { userId, height, goalWeight, currentPhase: currentPhase || "LEAN_BULKING" },
  });
}

export async function updateProfileInfo({ currentPhase, height, goalWeight }) {
  const session = await getSession();
  const userId = session.user.id;

  await prisma.userProfile.upsert({
    where: { userId },
    update: {
      currentPhase: currentPhase || "LEAN_BULKING",
      height: height ?? undefined,
      goalWeight: goalWeight ?? undefined,
    },
    create: {
      userId,
      currentPhase: currentPhase || "LEAN_BULKING",
      height,
      goalWeight,
    },
  });
}

export async function updateDailyTarget(formData) {
  const session = await getSession();
  const userId = session.user.id;

  const data = {
    calories: parseInt(formData.get("calories")),
    protein: parseFloat(formData.get("protein")),
    carbs: parseFloat(formData.get("carbs")),
    fat: parseFloat(formData.get("fat")),
    fiber: formData.get("fiber") ? parseFloat(formData.get("fiber")) : null,
  };

  await prisma.dailyTarget.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}
