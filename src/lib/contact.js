"use server";

import { Resend } from "resend";
import { allowed } from "@/lib/limit";

const resend = new Resend(process.env.RESEND_API_KEY);

const LIMITS = { name: 100, email: 200, subject: 200, message: 5000 };

function readField(formData, name) {
  const value = formData.get(name);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function looksLikeEmail(email) {
  const at = email.indexOf("@");
  const dot = email.lastIndexOf(".");
  if (at < 1 || dot < at + 2 || dot === email.length - 1) {
    return false;
  }
  return !email.includes(" ");
}

function problemWith(fields) {
  for (const name in LIMITS) {
    if (fields[name] === "") {
      return "missing";
    }
  }
  if (!looksLikeEmail(fields.email)) {
    return "email";
  }
  for (const name in LIMITS) {
    if (fields[name].length > LIMITS[name]) {
      return "long";
    }
  }
  return null;
}

export async function sendMessage(previous, formData) {
  if (readField(formData, "website") !== "") {
    return { status: "sent" };
  }

  const fields = {};
  for (const name in LIMITS) {
    fields[name] = readField(formData, name);
  }

  const problem = problemWith(fields);
  if (problem !== null) {
    return { status: "error", reason: problem, values: fields };
  }

  if (!(await allowed("contact"))) {
    return { status: "error", reason: "limited", values: fields };
  }

  const sender = fields.name.replaceAll("<", "").replaceAll(">", "").replaceAll('"', "");
  try {
    const result = await resend.emails.send({
      from: sender + " <contact@diogof146.com>",
      to: process.env.EMAIL,
      replyTo: fields.email,
      subject: fields.subject,
      text: "From: " + fields.name + " <" + fields.email + ">\n\n" + fields.message,
    });
    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error("Contact:", error);
    return { status: "error", reason: "failed", values: fields };
  }

  return { status: "sent" };
}
