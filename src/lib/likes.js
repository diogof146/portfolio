"use server";

import { Redis } from "@upstash/redis";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import { allowed } from "@/lib/limit";

const redis = Redis.fromEnv();

async function fetchLikeCount() {
  "use cache";
  cacheLife("days");
  cacheTag("likes");
  const count = await redis.get("like_count");
  if (count === null) {
    return 0;
  }
  return count;
}

export async function getLikeCount() {
  try {
    return await fetchLikeCount();
  } catch (error) {
    console.error("Likes:", error);
    return null;
  }
}

export async function incrementLike() {
  try {
    if (!(await allowed("like"))) {
      return await redis.get("like_count");
    }
    const count = await redis.incr("like_count");
    updateTag("likes");
    return count;
  } catch (error) {
    console.error("Likes:", error);
    return null;
  }
}
