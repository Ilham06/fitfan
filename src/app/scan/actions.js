"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function saveFoodLog(data) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;
  const { mealType, entries } = data;

  if (!entries || entries.length === 0) {
    return { error: "Tambahkan setidaknya satu item makanan." };
  }

  for (const e of entries) {
    if (!e.name || isNaN(e.calories) || e.calories < 0) {
      return { error: `Data tidak valid untuk item: ${e.name || "unnamed"}` };
    }
  }

  await prisma.foodLog.create({
    data: {
      userId,
      mealType: mealType || null,
      entries: {
        create: entries.map((e) => ({
          name: e.name,
          weightGrams: parseFloat(e.weightGrams) || 100,
          quantity: parseFloat(e.quantity) || 1,
          calories: parseFloat(e.calories),
          protein: parseFloat(e.protein) || 0,
          carbs: parseFloat(e.carbs) || 0,
          fat: parseFloat(e.fat) || 0,
          fiber: e.fiber ? parseFloat(e.fiber) : null,
        })),
      },
    },
  });

  return { success: true };
}

export async function deleteFoodLog(logId) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  const log = await prisma.foodLog.findUnique({ where: { id: logId } });
  if (!log || log.userId !== userId) {
    return { error: "Log tidak ditemukan." };
  }

  await prisma.foodLog.delete({ where: { id: logId } });
  return { success: true };
}

export async function updateWeightAndTargets({ weight, applyProtein, proteinGrams }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;
  const kg = parseFloat(weight);
  if (!kg || kg < 20 || kg > 300) {
    return { error: "Berat badan tidak valid." };
  }

  await prisma.userProfile.upsert({
    where: { userId },
    update: { currentWeight: kg },
    create: { userId, currentWeight: kg },
  });

  if (applyProtein && proteinGrams) {
    const protein = parseFloat(proteinGrams);
    const existing = await prisma.dailyTarget.findUnique({ where: { userId } });
    if (existing) {
      await prisma.dailyTarget.update({ where: { userId }, data: { protein } });
    } else {
      await prisma.dailyTarget.create({
        data: { userId, calories: 2500, protein, carbs: 300, fat: 70 },
      });
    }
  }

  return { success: true };
}
