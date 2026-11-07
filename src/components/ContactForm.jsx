"use client"

import { useActionState } from "react"
import { ArrowRight } from "lucide-react"
import { sendMessage } from "@/lib/contact"
import s from "./ContactForm.module.css"

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
    <form action={formAction} className={s.form}>
      <label className={"mono " + s.field}>
        {text.name}
        <input
          name="name"
          defaultValue={values.name}
          placeholder={text.placeholders.name}
          required
          maxLength={100}
          autoComplete="name"
        />
      </label>
      <label className={"mono " + s.field}>
        {text.email}
        <input
          name="email"
          type="email"
          defaultValue={values.email}
          placeholder={text.placeholders.email}
          required
          maxLength={200}
          autoComplete="email"
        />
      </label>
      <label className={"mono " + s.field + " " + s.wide}>
        {text.subject}
        <input name="subject" defaultValue={values.subject} placeholder={text.placeholders.subject} required maxLength={200} />
      </label>
      <label className={"mono " + s.field + " " + s.wide}>
        {text.message}
        <textarea
          name="message"
          rows={3}
          defaultValue={values.message}
          placeholder={text.placeholders.message}
          required
          maxLength={5000}
        />
      </label>

      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={s.actions + " " + s.wide}>
        <button type="submit" className="btn" disabled={isPending}>
          {isPending ? text.sending : text.send} <ArrowRight size={16} aria-hidden="true" />
        </button>
        {note && (
          <p role="status" className={"mono " + s.note}>
            {note}
          </p>
        )}
      </div>
    </form>
  )
}
