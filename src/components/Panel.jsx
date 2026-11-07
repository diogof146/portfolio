"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { ArrowUpRight, Menu, X } from "lucide-react"
import PortoClock from "@/components/PortoClock"
import Socials from "@/components/Socials"
import LanguageSwitch from "@/components/LanguageSwitch"
import InkWell from "@/components/InkWell"
import { INK_DROPS } from "@/motion/themes"
import s from "./Panel.module.css"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Panel({ lang, text, name, role, status, place, languageLabel, sections, allProjectsHref, face, nowCard }) {
  const dock = useRef(null)
  const panel = useRef(null)
  const faceLayer = useRef(null)
  const column = useRef(null)
  const links = useRef([])
  const barTrack = useRef(null)

  const [active, setActive] = useState(0)
  const [barShown, setBarShown] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useGSAP(function () {
    const hero = document.querySelector("[data-panel-hero]")
    const slot = document.querySelector("[data-panel-slot]")
    if (!hero || !slot) return

    function slotPlace() {
      const rect = slot.getBoundingClientRect()
      return { left: rect.left, top: rect.top + window.scrollY, width: rect.width, height: rect.height }
    }

    function dockPlace() {
      const rect = dock.current.getBoundingClientRect()
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    }

    function dockInstantly() {
      const place = dockPlace()
      gsap.set(panel.current, { left: place.left, top: place.top, width: place.width, height: place.height, autoAlpha: 0 })
      gsap.set(faceLayer.current, { autoAlpha: 0 })
      gsap.set(column.current, { autoAlpha: 1 })
      ScrollTrigger.create({
        trigger: hero,
        start: "bottom 60%",
        onEnter: function () {
          gsap.set(panel.current, { autoAlpha: 1 })
        },
        onLeaveBack: function () {
          gsap.set(panel.current, { autoAlpha: 0 })
        },
      })
    }

    function dockWithScroll() {
      gsap.set(panel.current, { autoAlpha: 1 })
      const flight = gsap.timeline({
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom 30%", scrub: 0.6, invalidateOnRefresh: true },
      })
      flight.fromTo(
        panel.current,
        {
          left: function () { return slotPlace().left },
          top: function () { return slotPlace().top },
          width: function () { return slotPlace().width },
          height: function () { return slotPlace().height },
        },
        {
          left: function () { return dockPlace().left },
          top: function () { return dockPlace().top },
          width: function () { return dockPlace().width },
          height: function () { return dockPlace().height },
          ease: "power2.inOut",
          duration: 1,
        },
        0,
      )
      flight.to(faceLayer.current, { autoAlpha: 0, duration: 0.25 }, 0.1)
      flight.fromTo(column.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 0.3)
    }

    function stepAsideAtContact(reduce) {
      const contact = document.getElementById("contact")
      if (!contact) return
      let outDuration = 0.7
      let backDuration = 0.9
      if (reduce) {
        outDuration = 0
        backDuration = 0
      }
      ScrollTrigger.create({
        trigger: contact,
        start: "top 65%",
        onEnter: function () {
          gsap.to(panel.current, { xPercent: 115, autoAlpha: 0, filter: "blur(10px)", duration: outDuration, ease: "power3.in", overwrite: "auto" })
        },
        onLeaveBack: function () {
          gsap.to(panel.current, { xPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: backDuration, ease: "expo.out", overwrite: "auto" })
        },
      })
    }

    const media = gsap.matchMedia()
    media.add(
      { desktop: "(min-width: 1100px)", reduce: "(prefers-reduced-motion: reduce)" },
      function (context) {
        if (!context.conditions.desktop) return
        gsap.set(slot.firstElementChild, { autoAlpha: 0 })
        if (context.conditions.reduce) {
          dockInstantly()
        } else {
          dockWithScroll()
        }
        stepAsideAtContact(context.conditions.reduce)
      },
    )

    media.add("(max-width: 1099px)", function () {
      ScrollTrigger.create({
        trigger: slot,
        start: "top 12%",
        onEnter: function () {
          setBarShown(true)
        },
        onLeaveBack: function () {
          setBarShown(false)
        },
      })
    })

    let current = 0
    for (let index = 0; index < sections.length; index++) {
      const element = document.getElementById(sections[index].id)
      if (!element) continue
      ScrollTrigger.create({
        trigger: element,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: function (self) {
          if (!self.isActive) return
          current = index
          setActive(index)
        },
        onUpdate: function (self) {
          const progress = self.progress.toFixed(3)
          const link = links.current[index]
          if (link) link.style.setProperty("--p", progress)
          if (current === index && barTrack.current) {
            barTrack.current.style.setProperty("--p", progress)
          }
        },
      })
    }
  })

  function closeMenu() {
    setMenuOpen(false)
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen)
  }

  let barClass = s.bar
  if (barShown) barClass = s.bar + " " + s.barShown
  let sheetClass = s.sheet
  if (menuOpen) sheetClass = s.sheet + " " + s.sheetOpen
  let menuLabel = text.openMenu
  if (menuOpen) menuLabel = text.closeMenu

  return (
    <>
      <div ref={dock} className={s.dock} aria-hidden="true" />

      <aside ref={panel} className={s.panel} aria-label={text.label}>
        <div ref={faceLayer} className={s.face}>
          {face}
        </div>
        <div ref={column} className={s.column}>
          <div>
            <div className={"display " + s.name}>{name}</div>
            <span className="mono muted">{role}</span>
          </div>
          <div className={"mono " + s.status}>
            <span className="status-dot" aria-hidden="true" />
            <span>{status}</span>
            <span className="muted">
              {place} <PortoClock />
            </span>
          </div>
          <nav aria-label={text.sections}>
            <ul className={s.navList}>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    ref={function (element) {
                      links.current[index] = element
                    }}
                    href={"#" + section.id}
                    className={s.navLink}
                    data-active={index === active}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
              <li>
                <Link href={allProjectsHref} className={s.navLink}>
                  {text.allProjects} <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </nav>
          <InkWell tone={INK_DROPS[sections[active].id]} label={text.stir} />
          <div className={s.foot}>
            {nowCard}
            <div className={s.footRow}>
              <Socials />
              <span className={"mono " + s.languages}>
                <LanguageSwitch lang={lang} label={languageLabel} />
              </span>
            </div>
          </div>
        </div>
      </aside>

      <div className={barClass}>
        <div className={s.barInfo}>
          <span className="mono">
            <PortoClock /> · {place}
          </span>
          <b>{sections[active].title}</b>
          <div ref={barTrack} className={s.barTrack}>
            <i />
          </div>
        </div>
        <button type="button" className={s.iconButton} aria-label={menuLabel} aria-expanded={menuOpen} onClick={toggleMenu}>
          {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </div>

      <div className={sheetClass}>
        {sections.map((section, index) => (
          <a key={section.id} href={"#" + section.id} className={s.navLink} data-active={index === active} onClick={closeMenu}>
            {section.title}
          </a>
        ))}
        <Link href={allProjectsHref} className={s.navLink}>
          {text.allProjects} <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
        <div className={s.footRow}>
          <Socials />
          <span className={"mono " + s.languages}>
            <LanguageSwitch lang={lang} label={languageLabel} />
          </span>
        </div>
      </div>
    </>
  )
}
