"use client"

import { useActionState } from "react"
import { sendMessage } from "@/lib/contact"

const start = { status: "idle", values: { name: "", email: "", subject: "", message: "" } }

export default function ContactForm({ text }) {
  const [result, formAction, isPending] = useActionState(sendMessage, start)

  let values = start.values
  if (result.values) {
    values = result.values
  }

  let note = null
  if (result.status === "sent") note = text.sent
  if (result.status === "error") note = text.errors[result.reason]

  return (
    <form action={formAction}>
      <label>
        {text.name}
        <input name="name" defaultValue={values.name} required maxLength={100} autoComplete="name" />
      </label>
      <label>
        {text.email}
        <input name="email" type="email" defaultValue={values.email} required maxLength={200} autoComplete="email" />
      </label>
      <label>
        {text.subject}
        <input name="subject" defaultValue={values.subject} required maxLength={200} />
      </label>
      <label>
        {text.message}
        <textarea name="message" defaultValue={values.message} required maxLength={5000} />
      </label>

      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? text.sending : text.send}
      </button>
      {note && <p role="status">{note}</p>}
    </form>
  )
}
