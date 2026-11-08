"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import dynamic from "next/dynamic"

const Terminal = dynamic(() => import("@/terminal/Terminal"), { ssr: false })

export const OPEN_TERMINAL = "terminal:open"

export function isTerminalShortcut(event) {
  return (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "k"
}

export default function TerminalLauncher() {
  const [open, setOpen] = useState(null)

  useEffect(
    function () {
      if (open) return

      function onKey(event) {
        if (!isTerminalShortcut(event)) return
        event.preventDefault()
        setOpen("shortcut")
      }
      function onOpen() {
        setOpen("click")
      }

      window.addEventListener("keydown", onKey)
      window.addEventListener(OPEN_TERMINAL, onOpen)
      return function () {
        window.removeEventListener("keydown", onKey)
        window.removeEventListener(OPEN_TERMINAL, onOpen)
      }
    },
    [open],
  )

  if (!open) return null

  return createPortal(
    <Terminal
      boot={open === "click"}
      onExit={function () {
        setOpen(null)
      }}
    />,
    document.body,
  )
}
