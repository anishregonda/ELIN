"use client"

import { motion } from "framer-motion"

interface FloatingOrbProps {
  size?: number
  delay?: number
  x?: string
  y?: string
  opacity?: number
}

export function FloatingOrb({
  size = 200,
  delay = 0,
  x = "50%",
  y = "50%",
  opacity = 0.06,
}: FloatingOrbProps) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full bg-primary"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        filter: `blur(${size * 0.6}px)`,
        opacity,
      }}
      animate={{
        y: [0, -20, 0, 15, 0],
        x: [0, 10, 0, -10, 0],
        scale: [1, 1.05, 1, 0.97, 1],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}
