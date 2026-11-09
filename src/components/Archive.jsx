"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Flip } from "gsap/Flip"
import { useGSAP } from "@gsap/react"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import LanguageSwitch from "@/components/LanguageSwitch"
import Print from "@/components/Print"
import InkLayer from "@/components/InkLayer"
import MeltPreview from "@/components/MeltPreview"
import s from "./Archive.module.css"

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP)

export default function Archive({ lang, text, nav, rows, kinds, count, span, homeHref }) {
  const list = useRef(null)
  const flipState = useRef(null)
  const meltRef = useRef(null)
  const [open, setOpen] = useState(null)
  const [kind, setKind] = useState("all")

  function preview(event, row) {
    if (!meltRef.current) return
    if (open === row.slug) {
      meltRef.current.hide()
      return
    }
    meltRef.current.place(event.clientX, event.clientY, true)
    meltRef.current.show(row.image.src)
  }

  function follow(event, row) {
    if (!meltRef.current || open === row.slug) return
    meltRef.current.place(event.clientX, event.clientY, false)
  }

  function hidePreview() {
    if (meltRef.current) meltRef.current.hide()
  }

  useEffect(
    function () {
      function openFromHash() {
        const slug = decodeURIComponent(window.location.hash.slice(1))
        let exists = false
        for (const row of rows) {
          if (row.type === "project" && row.slug === slug) exists = true
        }
        if (!exists) return
        setOpen(slug)
        setTimeout(function () {
          const element = document.getElementById(slug)
          if (element) element.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 300)
      }

      const timer = setTimeout(openFromHash, 0)
      window.addEventListener("hashchange", openFromHash)
      return function () {
        clearTimeout(timer)
        window.removeEventListener("hashchange", openFromHash)
      }
    },
    [rows],
  )

  useGSAP(
    function () {
      const bodies = list.current.querySelectorAll("[data-drawer-body]")
      for (const body of bodies) {
        let height = 0
        if (body.dataset.drawerBody === open) height = "auto"
        gsap.to(body, {
          height: height,
          duration: 0.7,
          ease: "expo.out",
          overwrite: true,
          onComplete: function () {
            ScrollTrigger.refresh()
          },
        })
      }
    },
    { dependencies: [open], scope: list },
  )

  useGSAP(
    function () {
      if (!flipState.current) return
      Flip.from(flipState.current, {
        duration: 0.7,
        ease: "expo.out",
        absoluteOnLeave: true,
        stagger: 0.02,
        onEnter: function (elements) {
          gsap.fromTo(elements, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.04 })
        },
        onLeave: function (elements) {
          gsap.to(elements, { autoAlpha: 0, duration: 0.25 })
        },
        onComplete: function () {
          ScrollTrigger.refresh()
        },
      })
      flipState.current = null
    },
    { dependencies: [kind], scope: list },
  )

  function choose(key) {
    if (key === kind) return
    flipState.current = Flip.getState(list.current.querySelectorAll("[data-flip]"))
    setKind(key)
  }

  function matches(row) {
    return kind === "all" || row.kind === kind
  }

  function visibleIn(group) {
    let visible = 0
    for (const row of rows) {
      if (row.type === "project" && row.group === group && matches(row)) visible = visible + 1
    }
    return visible
  }

  function toggle(slug) {
    if (open === slug) {
      setOpen(null)
    } else {
      setOpen(slug)
    }
  }

  return (
    <div className={s.archive}>
      <div className={"mono " + s.top}>
        <Link href={homeHref} className={s.back}>
          <ArrowLeft size={14} aria-hidden="true" /> {nav.home}
        </Link>
        <span>{count + " " + text.archive.projects + " · " + span}</span>
        <span className={s.languages}>
          <LanguageSwitch lang={lang} label={nav.language} />
        </span>
      </div>

      <header className={s.head}>
        <h1 className={"display " + s.title} data-reveal="title">
          {text.title}
        </h1>
        <p className="body-text" data-reveal="fade">
          {text.archive.intro}
        </p>
        <div className={s.filters} role="group" aria-label={text.archive.filter}>
          {kinds.map((option) => (
            <button
              key={option.key}
              type="button"
              className={s.filter}
              aria-pressed={kind === option.key}
              onClick={function () {
                choose(option.key)
              }}
            >
              {option.label}
              <sup>{option.count}</sup>
            </button>
          ))}
        </div>
      </header>

      <div ref={list} className={s.drawers} onMouseLeave={hidePreview}>
        {rows.map((row) => {
          if (row.type === "group") {
            const visible = visibleIn(row.group)
            let countLabel = text.archive.projects
            if (visible === 1) countLabel = text.archive.project
            return (
              <div key={row.key} className={s.groupRow} data-flip data-hidden={visible === 0}>
                <span className={"display " + s.groupName}>{row.label}</span>
                <span className="mono muted">{visible + " " + countLabel}</span>
              </div>
            )
          }

          const isOpen = open === row.slug
          let cursor = text.archive.open
          if (isOpen) cursor = text.archive.close
          return (
            <div
              key={row.key}
              id={row.slug}
              className={s.drawer}
              data-open={isOpen}
              data-flip
              data-hidden={!matches(row)}
              data-card
              data-developed={isOpen}
            >
              <button
                type="button"
                className={s.face}
                aria-expanded={isOpen}
                aria-controls={"body-" + row.slug}
                data-cursor={cursor}
                onClick={function () {
                  toggle(row.slug)
                  hidePreview()
                }}
                onMouseEnter={function (event) {
                  preview(event, row)
                }}
                onMouseMove={function (event) {
                  follow(event, row)
                }}
              >
                <span className="mono">{row.year}</span>
                <span className={s.drawerTitle}>{row.title}</span>
                <span className={"mono " + s.kind}>{row.kindLabel}</span>
                <span className={s.handle} aria-hidden="true" />
              </button>
              <div id={"body-" + row.slug} className={s.body} data-drawer-body={row.slug}>
                <div className={s.sheet}>
                  <Link className={s.picture} href={row.href} tabIndex={-1} aria-hidden="true" data-cursor={text.archive.page}>
                    <Print src={row.image} sizes="(min-width: 768px) 540px, 90vw">
                      <InkLayer />
                    </Print>
                  </Link>
                  <div>
                    <p className={"lead " + s.line}>{row.line}</p>
                    <ul className={s.chips}>
                      {row.stack.map((tool) => (
                        <li key={tool} className={s.chip}>
                          {tool}
                        </li>
                      ))}
                    </ul>
                    <div className={s.links}>
                      {row.github && (
                        <a className="btn-ghost" href={row.github} target="_blank" rel="noreferrer">
                          {text.links.code} <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                      )}
                      {row.live && (
                        <a className="btn-ghost" href={row.live} target="_blank" rel="noreferrer">
                          {row.liveLabel} <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                      )}
                      <Link className="btn" href={row.href}>
                        {text.archive.page} <ArrowUpRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <MeltPreview controlRef={meltRef} />
    </div>
  )
}
