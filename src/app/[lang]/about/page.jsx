import { Suspense } from "react"
import { getDictionary } from "@/content/lang"
import { interests, reading, riff } from "@/content/personal"
import { getTopArtists, getTopTrack, getMonthlyTrack } from "@/lib/spotify"
import NowPlaying from "@/components/NowPlaying"
import Track from "@/components/Track"

export default async function About({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const about = dict.about

  const topArtists = await getTopArtists()
  const topTrack = await getTopTrack()
  const onRepeat = await getMonthlyTrack()

  return (
    <main>
      <h1>{about.title}</h1>
      <p>{about.intro}</p>

      <section>
        <h2>{about.music.title}</h2>
        <Suspense fallback={null}>
          <NowPlaying label={about.music.nowPlaying} />
        </Suspense>
        <Track label={about.music.onRepeat} track={onRepeat} />
        <Track label={about.music.topTrack} track={topTrack} />
        {topArtists && (
          <>
            <h3>{about.music.topArtists}</h3>
            <ul>
              {topArtists.map((artist) => (
                <li key={artist.url}>
                  <a href={artist.url} target="_blank" rel="noreferrer">
                    {artist.name}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

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
