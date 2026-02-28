"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUp, Paperclip } from "lucide-react"

export function ChatInput() {
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-64 right-0 z-30 border-t border-border bg-background/80 px-6 py-4 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-3xl">
        <div
          className={`flex items-end gap-3 rounded-2xl border bg-card px-4 py-3 transition-colors ${
            isFocused ? "border-primary/50 shadow-sm shadow-primary/5" : "border-border"
          }`}
        >
          <button
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask ELIN anything about your studies..."
            rows={1}
            className="max-h-32 min-h-[2rem] flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = "auto"
              target.style.height = target.scrollHeight + "px"
            }}
          />
          <motion.button
            whileTap={{ scale: 0.92 }}
            disabled={!value.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          ELIN can help you study smarter. Ask a question to get started.
        </p>
      </div>
    </motion.div>
  )
}
