import { prisma } from "@/lib/prisma";
import { sendNotification } from "@/lib/notify";

const PHASE_PROTEIN = { LEAN_BULKING: 2.0, BULKING: 1.8, CUTTING: 2.2, MAINTENANCE: 1.6 };
const PHASE_CAL = { LEAN_BULKING: 38, BULKING: 40, CUTTING: 28, MAINTENANCE: 33 };

const MEAL_CONFIG = {
  breakfast: {
    hour: 7,
    title: "Sarapan dulu yuk! 🍳",
    mealLabel: "sarapan",
  },
  lunch: {
    hour: 12,
    title: "Waktunya makan siang! 🥗",
    mealLabel: "makan siang",
  },
  dinner: {
    hour: 19,
    title: "Jangan lupa makan malam! 🍽️",
    mealLabel: "makan malam",
  },
};

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getMealSlot(hour) {
  if (hour >= 5 && hour < 10) return "breakfast";
  if (hour >= 10 && hour < 15) return "lunch";
  if (hour >= 17 && hour < 22) return "dinner";
  return null;
}

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const jakartaHour = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })).getHours();
  const meal = getMealSlot(jakartaHour);

  if (!meal) {
    return Response.json({ skipped: true, reason: `Hour ${jakartaHour} not a meal slot` });
  }

  const config = MEAL_CONFIG[meal];

  const subscribedUserIds = await prisma.pushSubscription.findMany({
    select: { userId: true },
    distinct: ["userId"],
  });

  const userIds = subscribedUserIds.map((s) => s.userId);
  if (userIds.length === 0) {
    return Response.json({ skipped: true, reason: "No subscribed users" });
  }

  let sent = 0;

  for (const userId of userIds) {
    const [profile, target, todayEntries] = await Promise.all([
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.dailyTarget.findUnique({ where: { userId } }),
      prisma.foodEntry.findMany({
        where: {
          foodLog: {
            userId,
            date: { gte: startOfDay(now), lte: endOfDay(now) },
          },
        },
      }),
    ]);

    const weight = profile?.currentWeight ?? 65;
    const phase = profile?.currentPhase ?? "LEAN_BULKING";

    const calTarget = target?.calories ?? Math.round(weight * PHASE_CAL[phase]);
    const proteinTarget = target?.protein ?? Math.round(weight * PHASE_PROTEIN[phase]);

    const consumed = todayEntries.reduce(
      (acc, e) => ({
        calories: acc.calories + e.calories,
        protein: acc.protein + e.protein,
      }),
      { calories: 0, protein: 0 }
    );

    const calLeft = Math.max(0, calTarget - Math.round(consumed.calories));
    const proteinLeft = Math.max(0, Math.round(proteinTarget - consumed.protein));

    let body;
    if (consumed.calories === 0) {
      body = `Belum ada makanan tercatat hari ini. Target: ${calTarget} kcal & ${proteinTarget}g protein.`;
    } else {
      body = `Sisa kebutuhan: ${calLeft} kcal & ${proteinLeft}g protein. Yuk ${config.mealLabel}!`;
    }

    await sendNotification({
      userId,
      title: config.title,
      body,
      type: "REMINDER_MEAL",
      data: { meal },
    });

    sent++;
  }

  return Response.json({ ok: true, meal, sent });
}
