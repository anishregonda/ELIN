"use client"

import { motion } from "framer-motion"

const subjects = [
  { name: "Mathematics", progress: 72, color: "bg-primary" },
  { name: "Physics", progress: 45, color: "bg-sky-500" },
  { name: "Literature", progress: 88, color: "bg-emerald-500" },
  { name: "History", progress: 30, color: "bg-amber-500" },
]

export function StudyPlan() {
  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Study Plan
      </h3>
      <div className="flex flex-col gap-4">
        {subjects.map((subject, i) => (
          <div key={subject.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{subject.name}</span>
              <span className="text-xs font-medium text-muted-foreground">
                {subject.progress}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${subject.progress}%` }}
                transition={{
                  delay: 0.6 + i * 0.1,
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className={`h-full rounded-full ${subject.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
