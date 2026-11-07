"use client"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { setupReveals } from "@/motion/reveals"

gsap.registerPlugin(useGSAP)

export default function Reveals() {
  useGSAP(function () {
    setupReveals(document.body)
  })

  return null
}
