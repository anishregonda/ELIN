"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Gamepad2, Sparkles } from "lucide-react"

export function GameModeButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  return (
    <motion.div
      className="w-full"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
    >
      <Link href="/game" className="block">
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setIsActive(!isActive)}
      type="button"
      className="relative w-full overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 px-8 py-6 text-left transition-colors hover:border-primary/40 hover:bg-primary/15"
    >
      {/* Floating shimmer */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "200%", opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ width: "50%" }}
          />
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            animate={
              isActive
                ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }
                : { rotate: 0 }
            }
            transition={{
              duration: 1.5,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20"
          >
            <Gamepad2 className="h-6 w-6 text-primary" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Game Mode
            </h3>
            <p className="text-sm text-muted-foreground">
              {isActive
                ? "Challenge active — stay focused"
                : "Turn studying into a challenge"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
          <div
            className={`flex h-7 w-12 items-center rounded-full px-1 transition-colors ${
              isActive ? "bg-primary" : "bg-muted"
            }`}
          >
            <motion.div
              animate={{ x: isActive ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="h-5 w-5 rounded-full bg-foreground shadow-sm"
            />
          </div>
        </div>
      </div>
    </motion.button>
      </Link>
    </motion.div>
  )
}
