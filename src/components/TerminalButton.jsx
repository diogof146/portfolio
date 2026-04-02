"use client"

import { useTerminal } from "@/components/Terminal"
import { SquareTerminal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TerminalButton() {
  const { openTerminal } = useTerminal()

  return (
    <Button variant="outline" size="icon" className="rounded-full cursor-pointer" onClick={openTerminal}>
      <SquareTerminal className="h-5 w-5" />
    </Button>
  )
}

