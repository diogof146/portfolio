"use client"

import { useState } from "react"
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
    <button type="button" onClick={like}>
      {label} · {count}
    </button>
  )
}
