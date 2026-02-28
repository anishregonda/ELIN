"use client"

import { motion } from "framer-motion"
import { BookOpen, CheckCircle2, Clock, PenLine } from "lucide-react"

const activities = [
  {
    icon: CheckCircle2,
    text: "Completed Chapter 4: Linear Algebra",
    time: "2h ago",
    color: "text-emerald-400",
  },
  {
    icon: PenLine,
    text: "Wrote 3 practice essays",
    time: "5h ago",
    color: "text-primary",
  },
  {
    icon: BookOpen,
    text: "Started reading: Cognitive Science",
    time: "Yesterday",
    color: "text-sky-400",
  },
  {
    icon: Clock,
    text: "Studied for 2h 15m",
    time: "Yesterday",
    color: "text-amber-400",
  },
]

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Recent Activity
      </h3>
      <div className="flex flex-col gap-4">
        {activities.map((item, i) => (
          <motion.div
            key={i}
            initial={{ x: -8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
            className="flex items-start gap-3"
          >
            <div className={`mt-0.5 ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{item.text}</p>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
