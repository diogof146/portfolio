import GuitarTab from "@/components/GuitarTab"
import { riff } from "@/content/personal"

export default function Learning({ id, text }) {
  return (
    <section id={id}>
      <div className="section-head">
        <h2 className="display section-title" data-reveal="title">
          {text.title}
        </h2>
        <p className="lead" data-reveal="fade">
          <b>{riff.song}</b> {text.by + " " + riff.artist + "."}
        </p>
      </div>
      <GuitarTab riff={riff} text={text} />
    </section>
  )
}
