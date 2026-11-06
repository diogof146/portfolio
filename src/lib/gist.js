import { cacheLife } from "next/cache";
import { github } from "@/lib/github";
import { defaultLanguage } from "@/content/lang/languages";

async function fetchGistFiles() {
  "use cache";
  cacheLife("minutes");
  const gist = await github("/gists/" + process.env.NOW_GIST_ID);
  return gist.files;
}

function toNotes(content) {
  const notes = [];
  for (const line of content.split("\n")) {
    const note = line.trim();
    if (note !== "") {
      notes.push(note);
    }
  }
  return notes;
}

export async function getNow(lang) {
  try {
    const files = await fetchGistFiles();
    let file = files[lang + ".txt"];
    if (!file) {
      file = files[defaultLanguage + ".txt"];
    }
    if (!file) {
      return null;
    }
    return toNotes(file.content);
  } catch (error) {
    console.error(error);
    return null;
  }
}
