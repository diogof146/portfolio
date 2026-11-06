"use client"

import { usePathname } from "next/navigation"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { setupReveals } from "@/motion/reveals"

gsap.registerPlugin(useGSAP)

export default function Reveals() {
  const pathname = usePathname()

  useGSAP(
    function () {
      setupReveals(document.body)
    },
    { dependencies: [pathname], revertOnUpdate: true },
  )

  return null
}
