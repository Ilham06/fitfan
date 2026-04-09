"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function saveBodyScan(formData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  const weight = parseFloat(formData.get("weight"));
  const bodyFatPercent = formData.get("bodyFatPercent")
    ? parseFloat(formData.get("bodyFatPercent"))
    : null;
  const muscleMass = formData.get("muscleMass")
    ? parseFloat(formData.get("muscleMass"))
    : null;
  const bmi = formData.get("bmi") ? parseFloat(formData.get("bmi")) : null;
  const date = formData.get("date") ? new Date(formData.get("date")) : new Date();

  if (isNaN(weight) || weight <= 0) {
    return { error: "Berat badan tidak valid." };
  }

  await prisma.bodyScanLog.create({
    data: {
      userId,
      weight,
      bodyFatPercent,
      muscleMass,
      bmi,
      date,
    },
  });

  await prisma.userProfile.upsert({
    where: { userId },
    update: { currentWeight: weight },
    create: { userId, currentWeight: weight },
  });

  return { success: true };
}
