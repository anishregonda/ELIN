"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import kaboom from "kaboom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"

type PracticeQuestion = {
  question: string
  options: string[]
  correctIndex: number
}

type GameComponentProps = {
  topic?: string
  onClose?: () => void
}

export default function GameComponent({ topic = "general knowledge", onClose }: GameComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const kaboomCtxRef = useRef<ReturnType<typeof kaboom> | null>(null)
  const onConfusionHitRef = useRef<() => void>(() => {})
  const [showQuestion, setShowQuestion] = useState(false)
  const [questionData, setQuestionData] = useState<PracticeQuestion | null>(null)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showBreakPopup, setShowBreakPopup] = useState(false)
  const stillConfusedClicksRef = useRef<number[]>([])

  const FIVE_MIN_MS = 5 * 60 * 1000
  const TRIGGER_COUNT = 3

  const handleStillConfused = useCallback(() => {
    const now = Date.now()
    const clicks = stillConfusedClicksRef.current
    clicks.push(now)
    // Keep only clicks within last 5 minutes
    stillConfusedClicksRef.current = clicks.filter((t) => now - t < FIVE_MIN_MS)
    if (stillConfusedClicksRef.current.length > TRIGGER_COUNT) {
      setShowBreakPopup(true)
      stillConfusedClicksRef.current = []
    }
  }, [])

  const fetchPracticeQuestion = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/practice-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      })
      const data = await res.json()
      if (data.question) {
        setQuestionData({
          question: data.question,
          options: Array.isArray(data.options) ? data.options : ["Yes", "No", "Partially", "Not sure"],
          correctIndex: typeof data.correctIndex === "number" ? data.correctIndex : 0,
        })
      }
    } catch (e) {
      setQuestionData({
        question: "What did you learn from this topic?",
        options: ["A lot", "A bit", "Need to review", "Not sure"],
        correctIndex: 0,
      })
    } finally {
      setLoading(false)
    }
  }, [topic])

  const handleConfusionHit = useCallback(() => {
    fetchPracticeQuestion()
    setShowQuestion(true)
  }, [fetchPracticeQuestion])

  const speakText = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }, [])

  const closeQuestionAndResume = useCallback(() => {
    setShowQuestion(false)
    setQuestionData(null)
    if (kaboomCtxRef.current?.debug) {
      kaboomCtxRef.current.debug.paused = false
    }
  }, [])

  useEffect(() => {
    onConfusionHitRef.current = handleConfusionHit
  }, [handleConfusionHit])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const k = kaboom({
      root: container,
      width: 640,
      height: 400,
      scale: 1,
      crisp: true,
      background: [22, 22, 35],
      global: false,
    })
    kaboomCtxRef.current = k

    const {
      add,
      pos,
      rect,
      circle,
      area,
      body,
      color,
      text,
      setGravity,
      onKeyDown,
      onUpdate,
      onCollide,
      destroy,
      isKeyDown,
      anchor,
    } = k

    setGravity(1200)

    // Platforms
    const platform = (x: number, y: number, w: number, h: number) =>
      add([
        pos(x, y),
        rect(w, h),
        area(),
        body({ isStatic: true }),
        color(80, 70, 120),
        anchor("topleft"),
        "platform",
      ])

    platform(0, 350, 640, 50)
    platform(80, 260, 140, 20)
    platform(320, 200, 160, 20)
    platform(420, 280, 120, 20)
    platform(100, 150, 100, 20)
    platform(450, 130, 100, 20)

    // Player
    const player = add([
      pos(80, 280),
      rect(24, 32),
      area(),
      body(),
      color(100, 180, 255),
      anchor("topleft"),
      "player",
    ])

    // Score display
    let scoreCount = 0
    const scoreLabel = add([
      pos(12, 12),
      text("Orbs: 0", { size: 16 }),
      color(255, 255, 255),
      anchor("topleft"),
      "scoreLabel",
    ])

    // Knowledge Orbs
    const orbPositions: [number, number][] = [
      [120, 220],
      [380, 160],
      [480, 240],
      [140, 110],
      [500, 90],
      [280, 350],
    ]
    orbPositions.forEach(([x, y]) => {
      add([
        pos(x, y),
        circle(14),
        area(),
        color(255, 220, 100),
        anchor("center"),
        "orb",
      ])
    })

    // Confusion Monsters
    const monsterPositions: [number, number][] = [
      [360, 160],
      [150, 110],
      [250, 320],
    ]
    monsterPositions.forEach(([x, y]) => {
      add([
        pos(x, y),
        rect(28, 28),
        area(),
        body({ isStatic: true }),
        color(200, 80, 120),
        anchor("topleft"),
        "monster",
      ])
    })

    // Movement
    const SPEED = 320
    onUpdate(() => {
      if (k.debug.paused) return
      if (isKeyDown("left")) player.vel.x = -SPEED
      else if (isKeyDown("right")) player.vel.x = SPEED
      else player.vel.x = 0
    })
    onKeyDown("space", () => {
      if (player.isGrounded()) player.jump(420)
    })

    onCollide("player", "orb", (_, orb) => {
      destroy(orb)
      scoreCount++
      scoreLabel.text = `Orbs: ${scoreCount}`
      setScore(scoreCount)
    })

    onCollide("player", "monster", (_, monster) => {
      destroy(monster)
      k.debug.paused = true
      onConfusionHitRef.current()
    })

    return () => {
      kaboomCtxRef.current = null
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={containerRef}
        className="rounded-xl overflow-hidden border border-border bg-background"
        style={{ width: 640, height: 400 }}
      />
      <p className="text-sm text-muted-foreground">
        Arrow keys to move, Space to jump. Collect gold orbs for points. Avoid purple Confusion Monsters — they’ll pause the game and ask a practice question.
      </p>
      {onClose && (
        <Button variant="outline" onClick={onClose}>
          Exit game
        </Button>
      )}

      <Dialog open={showQuestion} onOpenChange={(open) => !open && closeQuestionAndResume()}>
        <DialogContent showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Practice question</DialogTitle>
          </DialogHeader>
          {loading ? (
            <p className="text-muted-foreground">Loading question…</p>
          ) : questionData ? (
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <p className="flex-1 font-medium text-foreground">{questionData.question}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => speakText(questionData.question)}
                  aria-label="Read question aloud"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {questionData.options.map((opt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start"
                    onClick={() => closeQuestionAndResume()}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Answer and continue — game will resume.
              </p>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={handleStillConfused}
              >
                Still Confused
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={showBreakPopup} onOpenChange={(open) => !open && setShowBreakPopup(false)}>
        <DialogContent showCloseButton={true} className="sm:max-w-md">
          <div className="flex flex-col items-center gap-6 py-4">
            <p className="text-center text-lg font-medium">
              Let&apos;s take a 1-minute break!
            </p>
            <div
              className="h-24 w-24 rounded-full bg-primary/30"
              style={{
                animation: "breathe 4s ease-in-out infinite",
              }}
            />
            <Button onClick={() => setShowBreakPopup(false)}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
