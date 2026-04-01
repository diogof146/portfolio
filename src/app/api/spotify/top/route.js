import { NextResponse } from "next/server";
import { getTopTrack, getAccessToken } from "@/lib/spotify";

export async function GET() {

  const { access_token } = await getAccessToken();
  let response = await getTopTrack(access_token);
  let song;

  if (response.status === 200) {
    song = (await response.json()).items[0];


    return NextResponse.json({
      title: song.name,
      artist: song.artists.map((_artist) => _artist.name).join(", "),
      albumImageUrl: song.album.images[0].url,
      songUrl: song.external_urls.spotify,
    });
  }
}

