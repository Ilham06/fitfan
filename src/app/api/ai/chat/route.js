import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PHASE_LABELS = {
  LEAN_BULKING: "Lean Bulking",
  BULKING: "Bulking",
  CUTTING: "Cutting",
  MAINTENANCE: "Maintenance",
};

export async function POST(req) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const { messages } = await req.json();

  const [profile, target, latestScan] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyTarget.findUnique({ where: { userId } }),
    prisma.bodyScanLog.findFirst({ where: { userId }, orderBy: { date: "desc" } }),
  ]);

  const systemPrompt = `You are Vitality AI, a premium personal fitness and nutrition assistant specialized in bulking and muscle building. You give personalized advice based on the user's biometrics.

User profile:
- Name: ${session.user.name}
- Current phase: ${PHASE_LABELS[profile?.currentPhase] || "Lean Bulking"}
- Height: ${profile?.height ? `${profile.height} cm` : "unknown"}
- Current weight: ${latestScan?.weight ? `${latestScan.weight} kg` : "unknown"}
- Goal weight: ${profile?.goalWeight ? `${profile.goalWeight} kg` : "not set"}
- Daily calorie target: ${target?.calories ? `${target.calories} kcal` : "not set"}
- Protein target: ${target?.protein ? `${target.protein}g` : "not set"}
- Carbs target: ${target?.carbs ? `${target.carbs}g` : "not set"}
- Body fat: ${latestScan?.bodyFatPercent ? `${latestScan.bodyFatPercent}%` : "unknown"}
- Muscle mass: ${latestScan?.muscleMass ? `${latestScan.muscleMass} kg` : "unknown"}

Keep responses concise and practical. Use metric units. When suggesting meals, include macros (calories, protein, carbs, fat). Always be encouraging and science-based.`;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
