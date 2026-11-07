"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useLenis } from "lenis/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

function parts() {
  const stage = document.querySelector("[data-contact-stage]")
  return {
    section: stage.closest("section"),
    stage: stage,
    lean: stage.querySelector("[data-wall-lean]"),
    wall: stage.querySelector("[data-wall]"),
    tiles: stage.querySelectorAll("[data-tile]"),
    shade: stage.querySelector("[data-shade]"),
    card: stage.querySelector("[data-contact-card]"),
    cardBack: stage.querySelector("[data-card-back]"),
    head: stage.querySelector("[data-contact-head]"),
    body: stage.querySelector("[data-contact-body]"),
    foot: stage.querySelector("footer"),
  }
}

function headlineFillingScreen(p) {
  const head = p.head
  const card = p.card
  const stage = p.stage
  return {
    x: stage.clientWidth / 2 - (card.offsetLeft + head.offsetLeft + head.offsetWidth / 2),
    y: stage.clientHeight / 2 - (card.offsetTop + head.offsetTop + head.offsetHeight / 2),
    scale: Math.min((stage.clientWidth * 0.86) / head.offsetWidth, (stage.clientHeight * 0.5) / head.offsetHeight),
  }
}

function takeover(p) {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: p.stage,
      start: "top top",
      end: "+=150%",
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      refreshPriority: 1,
    },
  })

  timeline.fromTo(
    p.wall,
    { rotationX: 62, rotation: -24, scale: 1.7, yPercent: 14 },
    { rotationX: 16, rotation: -7, scale: 1.08, yPercent: 0, ease: "power2.out", duration: 0.75 },
    0,
  )
  timeline.fromTo(
    p.tiles,
    {
      z: function () {
        return gsap.utils.random(-2600, -1200)
      },
      rotationY: function () {
        return gsap.utils.random(-110, 110)
      },
      rotationX: function () {
        return gsap.utils.random(-45, 45)
      },
      autoAlpha: 0,
      filter: "blur(14px)",
    },
    {
      z: 0,
      rotationY: 0,
      rotationX: 0,
      autoAlpha: 1,
      filter: "blur(0px)",
      ease: "power3.out",
      duration: 0.5,
      stagger: { amount: 0.3, from: "center", grid: "auto" },
    },
    0,
  )
  timeline.fromTo(p.shade, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.35)
  timeline.fromTo(
    p.head,
    {
      x: function () {
        return headlineFillingScreen(p).x
      },
      y: function () {
        return headlineFillingScreen(p).y
      },
      scale: function () {
        return headlineFillingScreen(p).scale
      },
    },
    { x: 0, y: 0, scale: 1, ease: "power3.inOut", duration: 0.4 },
    0.4,
  )
  timeline.fromTo(p.cardBack, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, ease: "power2.out", duration: 0.25 }, 0.66)
  timeline.fromTo(p.body.children, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.25, stagger: 0.06 }, 0.72)
  timeline.fromTo(p.foot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.92)
  return timeline.scrollTrigger
}

function assemble(p) {
  const timeline = gsap.timeline({
    scrollTrigger: { trigger: p.section, start: "top bottom", end: "top top", scrub: 0.8 },
  })
  timeline.fromTo(
    p.wall,
    { rotationX: 62, rotation: -24, scale: 1.7, yPercent: 14 },
    { rotationX: 16, rotation: -7, scale: 1.08, yPercent: 0, ease: "power2.out", duration: 1 },
    0,
  )
  timeline.from(
    p.tiles,
    {
      z: function () {
        return gsap.utils.random(-1800, -800)
      },
      rotationY: function () {
        return gsap.utils.random(-120, 120)
      },
      rotationX: function () {
        return gsap.utils.random(-50, 50)
      },
      autoAlpha: 0,
      duration: 0.65,
      ease: "power3.out",
      stagger: { amount: 0.35, from: "center", grid: "auto" },
    },
    0,
  )
}

function followPointer(p) {
  const moveX = gsap.quickTo(p.lean, "x", { duration: 0.6, ease: "power3" })
  const moveY = gsap.quickTo(p.lean, "y", { duration: 0.6, ease: "power3" })
  const turnY = gsap.quickTo(p.lean, "rotationY", { duration: 0.8, ease: "power3" })
  const turnX = gsap.quickTo(p.lean, "rotationX", { duration: 0.8, ease: "power3" })

  function follow(event) {
    const x = event.clientX / window.innerWidth - 0.5
    const y = event.clientY / window.innerHeight - 0.5
    moveX(x * 110)
    moveY(y * 80)
    turnY(x * 12)
    turnX(y * -9)
  }

  p.section.addEventListener("pointermove", follow)
  return function () {
    p.section.removeEventListener("pointermove", follow)
  }
}

function drift(p) {
  const loop = gsap.to(p.lean, { x: 26, y: -18, rotationY: 6, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true })
  ScrollTrigger.create({
    trigger: p.section,
    start: "top bottom",
    end: "bottom top",
    onToggle: function (self) {
      if (self.isActive) {
        loop.play()
      } else {
        loop.pause()
      }
    },
  })
}

function easeInOut(t) {
  if (t < 0.5) return 4 * t * t * t
  return 1 - Math.pow(-2 * t + 2, 3) / 2
}

function easeOut(t) {
  return Math.sin((t * Math.PI) / 2)
}

function goToContact(lenis, pin) {
  function playThrough() {
    lenis.scrollTo(pin.end, { duration: 2.6 * (1 - pin.progress), easing: easeOut })
  }

  if (lenis.scroll >= pin.start) {
    playThrough()
    return
  }
  let duration = 1.6
  if (pin.start - lenis.scroll < window.innerHeight) duration = 0.5
  lenis.scrollTo(pin.start, { duration: duration, easing: easeInOut, onComplete: playThrough })
}

export default function ContactMotion() {
  const pin = useRef(null)
  const lenis = useLenis()

  useGSAP(function () {
    const p = parts()
    gsap.set(p.wall, { rotationX: 16, rotation: -7, scale: 1.08 })

    const media = gsap.matchMedia()
    media.add("(min-width: 1100px) and (prefers-reduced-motion: no-preference)", function () {
      pin.current = takeover(p)
      return function () {
        pin.current = null
      }
    })

    media.add("(max-width: 1099px) and (prefers-reduced-motion: no-preference)", function () {
      assemble(p)
    })

    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", function () {
      return followPointer(p)
    })

    media.add("(hover: none) and (prefers-reduced-motion: no-preference), (pointer: coarse) and (prefers-reduced-motion: no-preference)", function () {
      drift(p)
    })
  })

  useEffect(
    function () {
      if (!lenis) return

      function onClick(event) {
        if (!(event.target instanceof Element)) return
        const link = event.target.closest('a[href="#contact"]')
        if (!link || !pin.current) return
        event.preventDefault()
        event.stopPropagation()
        goToContact(lenis, pin.current)
      }

      window.addEventListener("click", onClick, true)
      return function () {
        window.removeEventListener("click", onClick, true)
      }
    },
    [lenis],
  )

  return null
}
