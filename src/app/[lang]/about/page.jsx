import { getDictionary } from "@/content/lang"
import { interests, reading, riff } from "@/content/personal"

export default async function About({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const about = dict.about

  return (
    <main>
      <h1>{about.title}</h1>
      <p>{about.intro}</p>

      <section>
        <h2>{about.interestsTitle}</h2>
        {interests.map((key) => (
          <article key={key}>
            <h3>{about.interests[key].title}</h3>
            <p>{about.interests[key].text}</p>
          </article>
        ))}
      </section>

      <section>
        <h2>{about.reading}</h2>
        <p>{reading.title}</p>
      </section>

      <section>
        <h2>{about.learning}</h2>
        <p>
          {riff.song} · {riff.artist} · {riff.tuning}
        </p>
      </section>
    </main>
  )
}
