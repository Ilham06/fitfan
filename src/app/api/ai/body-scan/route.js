import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const BodyScanSchema = z.object({
  weight: z.number().nullable().describe("Body weight in kg"),
  bodyFatPercent: z.number().nullable().describe("Body fat percentage"),
  muscleMass: z.number().nullable().describe("Muscle mass in kg"),
  bmi: z.number().nullable().describe("BMI index"),
  waterPercent: z.number().nullable().describe("Body water percentage if shown"),
  boneMass: z.number().nullable().describe("Bone mass in kg if shown"),
  date: z.string().nullable().describe("Date of measurement if shown on receipt (YYYY-MM-DD format)"),
  confidence: z.number().min(0).max(100).describe("Confidence in extraction 0-100"),
  rawText: z.string().nullable().describe("Raw text extracted from the receipt/display"),
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
      schema: BodyScanSchema,
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
              text: `This is an image of a smart body scale display or printed receipt from a gym/clinic body composition scan.
              
              Extract all available body metrics:
              - Weight (kg)
              - Body fat percentage
              - Muscle mass (kg) 
              - BMI
              - Water percentage if shown
              - Bone mass if shown
              - Date of measurement if visible
              
              Return null for any metric not visible in the image.
              Be precise - use exact numbers shown on the display.`,
            },
          ],
        },
      ],
    });

    return Response.json(object);
  } catch (err) {
    console.error("Body scan OCR error:", err);
    return Response.json(
      { error: err.message || "Failed to process image" },
      { status: 500 }
    );
  }
}
