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
    const body = await req.json()
    const { topic, mode = "default" } = body

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic is required and must be a string" },
        { status: 400 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })
    const trimmedTopic = topic.trim()

    const rawMode = typeof mode === "string" ? mode : "default"
    const normalizedMode = rawMode.toLowerCase().replace(/\s+/g, "-")
    const isExamReady = normalizedMode === "exam-ready"
    const isGameMode = normalizedMode === "game-mode"

    let systemPrompt: string
    let userPrompt: string

    if (isGameMode) {
      systemPrompt = `You are a game designer and educator creating short 2D platformer-style levels to help students practice a topic.`
      userPrompt = `Based ONLY on the topic "${trimmedTopic}", return a JSON array of 4-6 level objects for a 2D game designed to help a student practice this topic.

Each level object MUST have exactly these fields:
- id: number
- name: string
- difficulty: "easy" | "medium" | "hard"
- objective: string
- description: string
- layoutHint: string (short description of the 2D layout, platforms, and obstacles)

Important:
- Respond with JSON ONLY (no backticks, no markdown, no extra text).
- The top-level value must be a JSON array.
- Make sure the JSON is valid and can be parsed directly.`
    } else if (isExamReady) {
      systemPrompt = `You are a study assistant helping students prepare for exams. When explaining a topic in Exam-Ready mode:
- Be concise and focused on what's likely to appear on exams
- Emphasize key definitions, formulas, and concepts
- Use bullet points for quick scanning and memorization
- Include common exam-style questions or question types students might see
- Highlight important distinctions and common pitfalls
- Structure the response for rapid revision: Key Points → Definitions → Summary
- Format your entire answer as clear bullet points (and nested bullets where helpful).`
      userPrompt = `Explain this topic in an exam-ready bullet-point format only: "${trimmedTopic}"`
    } else {
      systemPrompt = `You are a friendly study assistant. Explain topics clearly and thoroughly, using examples when helpful.`
      userPrompt = `Explain this topic: "${trimmedTopic}"`
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${systemPrompt}\n\n${userPrompt}`,
    })

    const rawText = response.text ?? ""

    if (isGameMode) {
      let levels: unknown = []
      const text = rawText.trim()

      try {
        const start = text.indexOf("[")
        const end = text.lastIndexOf("]")
        const jsonText =
          start !== -1 && end !== -1 ? text.slice(start, end + 1) : text
        levels = JSON.parse(jsonText)
      } catch {
        levels = []
      }

      return NextResponse.json(levels)
    }

    const text = rawText || "No explanation generated."

    return NextResponse.json({
      explanation: text,
      mode: isExamReady ? "exam-ready" : "default",
    })
  } catch (error) {
    console.error("[explain API]", error)
    return NextResponse.json(
      {
        error: "Failed to generate explanation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
