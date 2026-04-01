'use client'
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame } from "lucide-react"
import { incrementLike } from "@/lib/actions"

export default function LikeButton({ initialCount }) {
  const [count, setCount] = useState(initialCount)
  const [burst, setBurst] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const handleClick = async () => {
    if (isClicking) return
    setIsClicking(true)
    setBurst(true)
    setTimeout(() => setBurst(false), 700)
    setCount(c => c + 1)
    try {
      const updatedCount = await incrementLike()
      setCount(updatedCount)
    } catch {
      setCount(c => c - 1)
    } finally {
      setIsClicking(false)
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-3 cursor-pointer select-none border border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-colors rounded-full px-4 py-2"
    >
      <motion.div
        animate={burst ? {
          scale: [1, 1.6, 1.3, 1],
          filter: [
            "drop-shadow(0 0 0px hsl(var(--primary)))",
            "drop-shadow(0 0 18px hsl(var(--primary)))",
            "drop-shadow(0 0 10px hsl(var(--primary)))",
            "drop-shadow(0 0 0px hsl(var(--primary)))",
          ]
        } : {
          scale: 1,
          filter: "drop-shadow(0 0 0px hsl(var(--primary)))"
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Flame className="w-4 h-4 text-primary" />
      </motion.div>

      <span className="text-xs text-muted-foreground">Click if you like it</span>

      <div className="relative h-5 w-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-primary"
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.button>
  )
}
