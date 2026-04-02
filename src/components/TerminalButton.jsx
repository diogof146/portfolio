"use client"

import { useTerminal } from "@/components/Terminal"
import { SquareTerminal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TerminalButton({ variant }) {
  const { openTerminal } = useTerminal()

  if (variant === "button") {
    return (
      <Button variant="outline" size="icon" className="rounded-full cursor-pointer" onClick={openTerminal}>
        <SquareTerminal className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <button onClick={openTerminal} className="hover:text-primary transition-colors text-muted-foreground cursor-pointer">
      <SquareTerminal className="h-5 w-5" />
    </button>
  )
}
