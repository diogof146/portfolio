import { Maximize2 } from "lucide-react"
import { WINDOWS } from "./windows"
import s from "./terminal.module.css"

const INTERACTIVE = "a, button, input, textarea, select, label"

export default function Window({ id, big, focused, onFocus, onHover, onZoom, setRef, children }) {
  const meta = WINDOWS[id]

  let className = s.window
  if (focused) className = className + " " + s.focused

  function enter(event) {
    if (event.pointerType === "mouse") onHover()
  }

  function press(event) {
    onFocus()
    if (!big && event.pointerType === "mouse" && !event.target.closest(INTERACTIVE)) onZoom()
  }

  return (
    <section ref={setRef} className={className} aria-label={meta.name} onPointerEnter={enter} onPointerDown={press}>
      <header className={s.windowBar}>
        <span className={s.windowTitle}>{meta.title}</span>
        {!big && (
          <button type="button" className={s.zoom} onClick={onZoom} aria-label={"Bring " + meta.name + " to the big spot"}>
            <Maximize2 size={13} aria-hidden="true" />
          </button>
        )}
      </header>
      <div className={s.windowBody}>{children}</div>
    </section>
  )
}
