import { NextResponse } from "next/server";
import { getAccessToken, getTopArtists } from "@/lib/spotify";

export async function GET() {
  const { access_token } = await getAccessToken();
  const response = await getTopArtists(access_token);

  if (response.status === 200) {
    const data = await response.json();

    const artists = data.items.slice(0, 5).map((artist) => ({
      name: artist.name,
      image: artist.images[0].url,
      url: artist.external_urls.spotify,
    }));

    return NextResponse.json(artists);
  }
}
