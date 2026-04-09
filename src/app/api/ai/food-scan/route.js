import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const FoodAnalysisSchema = z.object({
  name: z.string().describe("Name of the complete meal or dish"),
  totalCalories: z.number().describe("Total estimated calories in kcal"),
  totalProtein: z.number().describe("Total protein in grams"),
  totalCarbs: z.number().describe("Total carbohydrates in grams"),
  totalFat: z.number().describe("Total fat in grams"),
  totalFiber: z.number().nullable().describe("Total fiber in grams if estimatable"),
  ingredients: z.array(
    z.object({
      name: z.string(),
      weightGrams: z.number(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    })
  ).describe("Individual ingredients or components identified in the food"),
  confidence: z.number().min(0).max(100).describe("AI confidence percentage 0-100"),
  notes: z.string().nullable().describe("Any notes about portion estimation or uncertainty"),
});

export async function POST(req) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = imageFile.type || "image/jpeg";

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-lite"),
      schema: FoodAnalysisSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: base64,
              mimeType,
            },
            {
              type: "text",
              text: `Analyze this food image and provide detailed nutritional information. 
              Identify all visible food items/ingredients.
              Estimate portion sizes based on visual cues.
              Provide macronutrient breakdown (calories, protein, carbs, fat, fiber if possible).
              Be as accurate as possible with standard food databases.`,
            },
          ],
        },
      ],
    });

    return Response.json(object);
  } catch (err) {
    console.error("Food scan AI error:", err);
    return Response.json(
      { error: err.message || "Failed to analyze image" },
      { status: 500 }
    );
  }
}
