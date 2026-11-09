import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

const redis = Redis.fromEnv();

const limiters = {
  contact: new Ratelimit({ redis: redis, limiter: Ratelimit.slidingWindow(3, "10 m"), prefix: "limit:contact" }),
  like: new Ratelimit({ redis: redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "limit:like" }),
  terminal: new Ratelimit({ redis: redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "limit:terminal" }),
  itch: new Ratelimit({ redis: redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "limit:itch" }),
};

async function visitorIp() {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for");
  if (!forwarded) {
    return "unknown";
  }
  return forwarded.split(",")[0].trim();
}

export async function allowed(name) {
  const ip = await visitorIp();
  try {
    const result = await limiters[name].limit(ip);
    return result.success;
  } catch (error) {
    console.error("Rate limit:", error);
    return true;
  }
}
