import { cacheLife } from "next/cache";

const QUERY = "query ($id: Int) { Media(id: $id, type: MANGA) { coverImage { large } siteUrl } }";

async function fetchManga(id) {
  "use cache";
  cacheLife("days");
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { id: id } }),
  });
  if (!res.ok) {
    throw new Error("AniList: " + res.status);
  }
  const data = await res.json();
  const media = data.data.Media;
  if (!media) {
    throw new Error("AniList: no manga with id " + id);
  }
  return {
    cover: media.coverImage.large,
    url: media.siteUrl,
  };
}

export async function getManga(id) {
  try {
    return await fetchManga(id);
  } catch (error) {
    console.error(error);
    return null;
  }
}
