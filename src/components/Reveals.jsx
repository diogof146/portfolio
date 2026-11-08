"use client"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { setupReveals } from "@/motion/reveals"
import { fitTitles } from "@/motion/fit"

gsap.registerPlugin(useGSAP)

export default function Reveals() {
  useGSAP(function () {
    const stopFitting = fitTitles(document.body)
    setupReveals(document.body)
    return stopFitting
  })

  return null
}
