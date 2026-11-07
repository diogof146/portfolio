import { Suspense } from "react"
import PortoClock from "@/components/PortoClock"
import Socials from "@/components/Socials"
import LabelBoxListening from "@/components/LabelBoxListening"
import s from "./LabelBox.module.css"

function ListeningPlaceholder({ text }) {
  return (
    <div className={"mono " + s.cell}>
      <span>{text.onRepeat}</span>
      <b>…</b>
    </div>
  )
}

export default function LabelBox({ text }) {
  return (
    <div className={s.box}>
      <div className={"mono " + s.cell}>
        <span>{text.status}</span>
        <b className={s.statusValue}>
          <span className="status-dot" aria-hidden="true" />
          {text.open}
        </b>
      </div>
      <div className={"mono " + s.cell}>
        <span>{text.place}</span>
        <b>
          <PortoClock />
        </b>
      </div>
      <Suspense fallback={<ListeningPlaceholder text={text} />}>
        <LabelBoxListening text={text} />
      </Suspense>
      <div className={"mono " + s.cell}>
        <span>{text.findMe}</span>
        <Socials />
      </div>
    </div>
  )
}
