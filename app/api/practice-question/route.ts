import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

const apiKey = process.env.GOOGLE_GEMINI_API_KEY

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_GEMINI_API_KEY is not configured" },
      { status: 500 }
    )
  }

  try {
    const body = await req.json().catch(() => ({}))
    const topic =
      typeof body?.topic === "string" ? body.topic.trim() : "general knowledge"

    const ai = new GoogleGenAI({ apiKey })
    const prompt = `You are a study assistant. Generate ONE practice question to test understanding of: "${topic}".

Respond with valid JSON only, no other text or markdown. Use this exact structure:
{"question":"Your question here?","options":["Option A","Option B","Option C","Option D"],"correctIndex":0}

- question: string, the question text
- options: array of exactly 4 strings (multiple choice)
- correctIndex: number 0-3, the index of the correct option

If the topic is very narrow, you may use 2-3 options instead; then correctIndex must be 0, 1, or 2.`

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    })

    const rawText = (response.text ?? "").trim()
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : rawText
    let data: { question: string; options: string[]; correctIndex: number }
    try {
      data = JSON.parse(jsonStr)
    } catch {
      return NextResponse.json({
        question: rawText || "What is the main idea of this topic?",
        options: ["Yes", "No", "Partially", "Not sure"],
        correctIndex: 0,
      })
    }
    if (!Array.isArray(data.options)) data.options = ["Yes", "No", "Partially", "Not sure"]
    data.correctIndex = Math.max(0, Math.min(data.correctIndex ?? 0, data.options.length - 1))
    return NextResponse.json(data)
  } catch (error) {
    console.error("[practice-question API]", error)
    return NextResponse.json(
      {
        error: "Failed to generate practice question",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
