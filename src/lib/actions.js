'use server'
import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

export async function incrementLike() {
  const newCount = await kv.incr("like_count");
  revalidatePath("/");
  return newCount;
}

export async function getLikeCount() {
  const count = await kv.get("like_count");
  return count ?? 0;
}
