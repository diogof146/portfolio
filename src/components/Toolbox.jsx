"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import ToolMorph from "@/components/ToolMorph"
import s from "./Toolbox.module.css"

gsap.registerPlugin(ScrollTrigger, useGSAP)

function twoDigits(number) {
  if (number < 10) return "0" + number
  return String(number)
}

export default function Toolbox({ title, text, groups }) {
  const [open, setOpen] = useState(0)
  const list = useRef(null)

  useGSAP(
    function () {
      const bodies = list.current.querySelectorAll("[data-tool-body]")
      for (let index = 0; index < bodies.length; index++) {
        let height = 0
        if (index === open) height = "auto"
        gsap.to(bodies[index], {
          height: height,
          duration: 0.75,
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

  const current = groups[open]

  return (
    <section id="toolbox" className={s.toolbox} data-theme="cyan">
      <div className={s.grid}>
        <div className={"section-head " + s.head}>
          <h2 className="display section-title" data-reveal="title">
            {title}
          </h2>
          <p className="body-text" data-reveal="fade">
            {text.intro}
          </p>
        </div>

        <div className={s.stage}>
          <div className={s.object}>
            <span className={s.shadow} aria-hidden="true" />
            <ToolMorph index={open} />
          </div>
          <p className={"mono " + s.now} aria-live="polite">
            <span>{twoDigits(open + 1)}</span>
            <b>{current.name}</b>
            <span>{current.tools.length + " " + text.tools}</span>
          </p>
        </div>

        <div ref={list} className={s.list}>
          {groups.map((group, index) => {
            const isOpen = index === open
            let cursor = text.open
            if (isOpen) cursor = ""
            let startHeight = 0
            if (index === 0) startHeight = "auto"
            return (
              <div key={group.id} className={s.row} data-open={isOpen}>
                <button
                  type="button"
                  className={s.rowHead}
                  aria-expanded={isOpen}
                  data-cursor={cursor}
                  onClick={function () {
                    setOpen(index)
                  }}
                >
                  <span className={"mono " + s.number}>{twoDigits(index + 1)}</span>
                  <span className={"display " + s.name}>{group.name}</span>
                </button>
                <div className={s.body} data-tool-body style={{ height: startHeight }}>
                  <div className={s.inner}>
                    <p className={s.tools}>{group.tools.join(" · ")}</p>
                    <p className={"mono " + s.used}>
                      <span className="muted">{text.usedIn}</span>
                      {group.projects.map((project) => (
                        <Link key={project.href} href={project.href}>
                          {project.title}
                        </Link>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
