"use client"

import { SquareTerminal } from "lucide-react"
import { OPEN_TERMINAL } from "@/components/TerminalLauncher"

export default function TerminalButton({ label, className }) {
  function open() {
    window.dispatchEvent(new Event(OPEN_TERMINAL))
  }

  return (
    <button type="button" className={className} onClick={open}>
      {label} <SquareTerminal size={14} aria-hidden="true" />
    </button>
  )
}
