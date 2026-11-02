import { getPlayingNow } from "@/lib/steam"
import Game from "@/components/Game"

export default async function PlayingNow({ label }) {
  const game = await getPlayingNow()
  return <Game label={label} game={game} />
}
