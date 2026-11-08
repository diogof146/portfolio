"use client"

import { useHold } from "@/components/Exposure"
import s from "./HoldButton.module.css"

function centreOf(element) {
  const box = element.getBoundingClientRect()
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 }
}

function isHoldKey(event) {
  return event.key === " " || event.key === "Enter"
}

export default function HoldButton({ text, fromHome = false, compact = false, className = "" }) {
  const hold = useHold()

  let label = text.toHome
  let action = text.toHomeLabel
  if (fromHome) {
    label = text.toOther
    action = text.toOtherLabel
  }
  if (compact) label = text.short

  function begin(element) {
    const centre = centreOf(element)
    hold.controls.current.start(centre.x, centre.y)
  }

  function end() {
    hold.controls.current.cancel()
  }

  function press(event) {
    event.currentTarget.setPointerCapture(event.pointerId)
    begin(event.currentTarget)
  }

  function keyDown(event) {
    if (!isHoldKey(event) || event.repeat) return
    event.preventDefault()
    begin(event.currentTarget)
  }

  function keyUp(event) {
    if (isHoldKey(event)) end()
  }

  function noMenu(event) {
    event.preventDefault()
  }

  return (
    <button
      type="button"
      className={"mono " + s.button + " " + className}
      aria-label={action}
      onPointerDown={press}
      onPointerUp={end}
      onPointerCancel={end}
      onKeyDown={keyDown}
      onKeyUp={keyUp}
      onContextMenu={noMenu}
    >
      <svg className={s.ring} viewBox="0 0 30 30" aria-hidden="true">
        <circle className={s.track} cx="15" cy="15" r="13" />
        <circle className={s.fill} cx="15" cy="15" r="13" />
      </svg>
      {label}
    </button>
  )
}
