"use client"

import Link from "next/link"
import GameComponent from "@/GameComponent"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function GamePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" aria-label="Back to dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Study Platformer</h1>
        </div>
        <GameComponent topic="general knowledge" onClose={() => window.history.back()} />
      </div>
    </div>
  )
}
