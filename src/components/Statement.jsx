import s from "./Statement.module.css"

function withEmphasis(text) {
  const parts = text.split("*")
  const result = []
  for (let index = 0; index < parts.length; index++) {
    if (index % 2 === 1) {
      result.push(<em key={index}>{parts[index]}</em>)
    } else {
      result.push(parts[index])
    }
  }
  return result
}

export default function Statement({ text, label }) {
  return (
    <section className={s.manifesto} data-theme="paper" aria-label={label}>
      <p className={s.statement} data-reveal="fill">
        {withEmphasis(text)}
      </p>
    </section>
  )
}
