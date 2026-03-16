import { NextResponse } from "next/server";
import { getNowPlaying, getMostPlayed } from "@/lib/spotify";

export async function GET() {

  let response = await getNowPlaying();
  let song;

  if (response.status === 200) {
    song = await response.json();

    if (song.is_playing && song.currently_playing_type === 'track') {
      return NextResponse.json({
        isPlaying: true,
        title: song.item.name,
        artist: song.item.artists.map((_artist) => _artist.name).join(", "),
        albumImageUrl: song.item.album.images[0].url,
        songUrl: song.item.external_urls.spotify,
      });
    }
  }

  response = await getMostPlayed();
  song = (await response.json()).items[0];

  return NextResponse.json({
    isPlaying: false,
    title: song.name,
    artist: song.artists.map((_artist) => _artist.name).join(", "),
    albumImageUrl: song.album.images[0].url,
    songUrl: song.external_urls.spotify,
  });
}
