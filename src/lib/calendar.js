import { cacheLife } from "next/cache";
import { connection } from "next/server";

function unfold(text) {
  const lines = [];
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    if (line.startsWith(" ")) {
      lines[lines.length - 1] = lines[lines.length - 1] + line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

function toDay(value) {
  return value.slice(0, 4) + "-" + value.slice(4, 6) + "-" + value.slice(6, 8);
}

function parseExams(text) {
  const exams = [];
  let current = null;
  for (const line of unfold(text)) {
    if (line === "BEGIN:VEVENT") {
      current = {};
    } else if (line === "END:VEVENT") {
      exams.push(current);
      current = null;
    } else if (current !== null) {
      const colon = line.indexOf(":");
      const name = line.slice(0, colon).split(";")[0];
      const value = line.slice(colon + 1);
      if (name === "SUMMARY") {
        current.title = value;
      }
      if (name === "DTSTART") {
        current.day = toDay(value);
      }
    }
  }
  return exams;
}

async function fetchExams() {
  "use cache";
  cacheLife("hours");
  const res = await fetch(process.env.EXAMS_ICS_URL);
  if (!res.ok) {
    throw new Error("Calendar: " + res.status);
  }
  return parseExams(await res.text());
}

export async function getNextExam() {
  await connection();
  try {
    const exams = await fetchExams();
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon" }).format(new Date());

    let next = null;
    for (const exam of exams) {
      if (exam.day >= today && (next === null || exam.day < next.day)) {
        next = exam;
      }
    }
    if (next === null) {
      return null;
    }

    const daysLeft = Math.round((new Date(next.day) - new Date(today)) / 86400000);
    return {
      title: next.title,
      day: next.day,
      daysLeft: daysLeft,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
