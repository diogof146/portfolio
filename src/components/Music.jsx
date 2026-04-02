import { Suspense } from "react"
import { SpotifyPlaylist, SpotifyTopArtists, SpotifyTopSong, SpotifyCardSkeleton, SpotifyArtistsSkeleton } from "@/components/Spotify/SpotifyStaticCards";
import { SpotifyMainCard } from "@/components/Spotify/SpotifyMainCard";

export function Music() {
  return (
    <section id="music" className="py-12 max-w-7xl mx-auto px-6">
      <div className="mb-10 text-center md:text-left">
        <span className="text-primary font-semibold tracking-wider text-sm">Spotify</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">My Music</h2>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SpotifyMainCard />
          <Suspense fallback={<SpotifyCardSkeleton />}>
            <SpotifyTopSong />
          </Suspense>
          <Suspense fallback={<SpotifyCardSkeleton />}>
            <SpotifyPlaylist />
          </Suspense>
        </div>
        <div className="w-full">
          <Suspense fallback={<SpotifyArtistsSkeleton />}>
            <SpotifyTopArtists />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
