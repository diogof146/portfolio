import { cacheLife } from "next/cache";

const token = process.env.GITHUB_TOKEN;

export async function github(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("GitHub " + path + ": " + res.status);
  }
  return await res.json();
}

async function fetchLatestPush() {
  "use cache";
  cacheLife({ revalidate: 900 });

  const events = await github("/users/diogof146/events/public?per_page=30");
  let latest = null;
  for (const event of events) {
    if (event.type !== "PushEvent") {
      continue;
    }
    if (latest === null || event.created_at > latest.created_at) {
      latest = event;
    }
  }
  if (latest === null) {
    return null;
  }

  const commit = await github(`/repos/${latest.repo.name}/commits/${latest.payload.head}`);
  return {
    repo: latest.repo.name,
    message: commit.commit.message.split("\n")[0],
    date: latest.created_at,
    url: `https://github.com/${latest.repo.name}`,
  };
}

export async function getLatestPush() {
  try {
    return await fetchLatestPush();
  }
  catch (error) {
    console.error("error fetching latest push:", error);
    return null;
  }
}
