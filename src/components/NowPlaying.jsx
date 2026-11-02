import { getNowPlaying } from "@/lib/spotify"
import Track from "@/components/Track"

export default async function NowPlaying({ label }) {
  const track = await getNowPlaying()
  return <Track label={label} track={track} />
}
