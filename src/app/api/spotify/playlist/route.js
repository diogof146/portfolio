import { NextResponse } from "next/server";
import { getPlaylist, getAccessToken } from "@/lib/spotify";

export async function GET() {

  const { access_token } = await getAccessToken();
  let response = await getPlaylist(access_token);
  let playlist;

  if (response.status === 200) {
    playlist = await response.json();

    return NextResponse.json({
      title: playlist.name,
      imageURL: playlist.images[0].url,
      url: playlist.external_urls.spotify,
    });
  }
}

