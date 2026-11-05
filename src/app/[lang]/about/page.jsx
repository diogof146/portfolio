import { Suspense } from "react"
import Image from "next/image"
import { getDictionary } from "@/content/lang"
import { interests, reading, riff } from "@/content/personal"
import { getTopArtists, getTopTrack, getMonthlyTrack } from "@/lib/spotify"
import { getMostPlayedGame, getLastPlayedGame } from "@/lib/steam"
import { getManga } from "@/lib/anilist"
import { getWeather } from "@/lib/weather"
import NowPlaying from "@/components/NowPlaying"
import PlayingNow from "@/components/PlayingNow"
import Track from "@/components/Track"
import Game from "@/components/Game"
import Weather from "@/components/Weather"

export default async function About({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const about = dict.about

  const topArtists = await getTopArtists()
  const topTrack = await getTopTrack()
  const onRepeat = await getMonthlyTrack()
  const mostPlayed = await getMostPlayedGame()
  const lastPlayed = await getLastPlayedGame()
  const manga = await getManga(reading.anilistId)
  const weather = await getWeather()

  return (
    <main>
      <h1>{about.title}</h1>
      <p>{about.intro}</p>

      <section>
        <h2>{about.weather.title}</h2>
        <Weather weather={weather} kinds={about.weather.kinds} />
      </section>

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
        <h2>{about.games.title}</h2>
        <Suspense fallback={null}>
          <PlayingNow label={about.games.playingNow} />
        </Suspense>
        <Game label={about.games.mostPlayed} game={mostPlayed} />
        <Game label={about.games.lastPlayed} game={lastPlayed} />
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
        {manga && (
          <a href={manga.url} target="_blank" rel="noreferrer">
            <Image src={manga.cover} alt={reading.title} width={230} height={345} />
          </a>
        )}
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
