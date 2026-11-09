"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { incrementLike } from "@/lib/likes"

export default function LikeButton({ initialCount, label }) {
  const [count, setCount] = useState(initialCount)

  async function like() {
    setCount((current) => current + 1)
    const updated = await incrementLike()
    if (updated !== null) {
      setCount(updated)
    }
  }

  return (
    <button type="button" onClick={like} aria-label={label + " · " + count} data-cursor={label}>
      <Heart size={15} aria-hidden="true" /> {count}
    </button>
  )
}
