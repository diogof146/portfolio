import Print from "@/components/Print"
import Vinyl from "@/components/Vinyl"
import SoundtrackMotion from "@/components/SoundtrackMotion"
import { getTopArtists, getTopTrack } from "@/lib/spotify"
import s from "./Soundtrack.module.css"

const SIZES = "(min-width: 768px) 560px, 54vw"

function Artist({ artist, number, text }) {
  return (
    <a className={s.item} href={artist.url} target="_blank" rel="noreferrer" data-sound data-cursor="Spotify">
      <div className={s.cover}>{artist.image && <Print src={artist.image} sizes={SIZES} />}</div>
      <span className={s.caption}>
        <span className="mono">{text.artist + number}</span>
        <b className="display">{artist.name}</b>
      </span>
    </a>
  )
}

function Record({ song, text }) {
  return (
    <a className={s.record} href={song.url} target="_blank" rel="noreferrer" data-record data-cursor={text.play}>
      {song.image && (
        <span className={s.disc} data-disc aria-hidden="true">
          <Vinyl label={song.image} />
        </span>
      )}
      <div className={s.sleeve} data-developed="true">
        {song.image && <Print src={song.image} sizes={SIZES} />}
      </div>
      <span className={s.recordCaption} data-caption>
        <span className="mono">{text.song}</span>
        <b className="display">{song.title}</b>
        <span className="muted">{song.artist}</span>
      </span>
    </a>
  )
}

export default async function Soundtrack({ text }) {
  const artists = await getTopArtists()
  const song = await getTopTrack()
  if (artists === null && song === null) return null

  return (
    <SoundtrackMotion className={s.sound}>
      <div className={s.sticky}>
        <span className={"mono " + s.note}>{text.note}</span>
        <h2 className={"display " + s.word} data-word>
          {text.title}
        </h2>
        {artists &&
          artists.map((artist, index) => <Artist key={artist.url} artist={artist} number={index + 1} text={text} />)}
        {song && <Record song={song} text={text} />}
      </div>
    </SoundtrackMotion>
  )
}
