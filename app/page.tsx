"use client"

import { motion } from "framer-motion"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { FloatingOrb } from "@/components/dashboard/floating-orb"
import { StatCards } from "@/components/dashboard/stat-cards"
import { GameModeButton } from "@/components/dashboard/game-mode-button"
import { ChatInput } from "@/components/dashboard/chat-input"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { StudyPlan } from "@/components/dashboard/study-plan"

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 overflow-hidden">
        <FloatingOrb size={300} x="70%" y="20%" delay={0} opacity={0.04} />
        <FloatingOrb size={200} x="20%" y="60%" delay={3} opacity={0.03} />
        <FloatingOrb size={160} x="80%" y="70%" delay={6} opacity={0.035} />
      </div>

      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <main className="relative ml-64 min-h-screen pb-32">
        <div className="mx-auto max-w-4xl px-8 py-10">
          {/* Header */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Good evening
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {"You've studied 2h 15m today. Keep it up."}
            </p>
          </motion.div>

          {/* Stats row */}
          <div className="mb-6">
            <StatCards />
          </div>

          {/* Game Mode */}
          <div className="mb-6">
            <GameModeButton />
          </div>

          {/* Two columns: Study Plan + Activity */}
          <div className="grid gap-4 md:grid-cols-2">
            <StudyPlan />
            <ActivityFeed />
          </div>
        </div>
      </main>

      {/* Chat input */}
      <ChatInput />
    </div>
  )
}
