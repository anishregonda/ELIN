"use client"

import { motion } from "framer-motion"
import { Clock, Flame, Target, Zap } from "lucide-react"

const stats = [
  {
    label: "Study Hours",
    value: "12.5h",
    sub: "This week",
    icon: Clock,
  },
  {
    label: "Streak",
    value: "7 days",
    sub: "Personal best",
    icon: Flame,
  },
  {
    label: "Completed",
    value: "24",
    sub: "Tasks done",
    icon: Target,
  },
  {
    label: "Focus Score",
    value: "89%",
    sub: "+4% from last week",
    icon: Zap,
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: "easeOut" }}
          className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </span>
            <stat.icon className="h-3.5 w-3.5 text-primary/60" />
          </div>
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
        </motion.div>
      ))}
    </div>
  )
}
