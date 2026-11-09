"use client"

import { SquareTerminal } from "lucide-react"
import { OPEN_TERMINAL } from "@/components/TerminalLauncher"

export default function TerminalButton({ label, size = 17 }) {
  function open() {
    window.dispatchEvent(new Event(OPEN_TERMINAL))
  }

  return (
    <button type="button" onClick={open} aria-label={label} data-cursor={label}>
      <SquareTerminal size={size} aria-hidden="true" />
    </button>
  )
}
