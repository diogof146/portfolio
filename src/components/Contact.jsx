"use client"

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useState } from "react";

export default function Contact() {

  const [status, setStatus] = useState('idle');

  async function sendMessage(e) {
    e.preventDefault();
    setStatus("loading")

    const formData = new FormData(e.target);
    const content = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      })

      if (!response.ok) {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 1500);
        return;
      }

      setStatus("success");
      e.target.reset();
      setTimeout(() => setStatus('idle'), 1500);

    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 1500);
    }
  }

  return (

    <section id="contact" className="py-24 max-w-7xl mx-auto px-6">

      <div className="mb-10 text-center md:text-left">
        <span className="text-primary font-semibold tracking-wider text-sm">Get in Touch</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Contact Me</h2>
      </div>

      <Card className="max-w-7xl mx-auto p-8 shadow-sm border-border/50 hover:shadow-md transition-all">


        <form onSubmit={sendMessage} className="w-full">

          <FieldSet className="w-full space-y-6">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input name="name" id="name" placeholder="Your Name" required></Input>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input name="email" id="email" type="email" placeholder="Your Email" required></Input>
              </Field>
              <Field>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <Input name="subject" id="subject" placeholder="Subject" required></Input>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea name="message"
                  id="message"
                  placeholder="Leave me a messsage..." required
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
            <Button type="reset" className="mt-4 bg-cyan-900 text-white">Clear</Button>
            <Button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`mt-4 transition-all ${status === 'success' ? 'bg-green-800 text-white' :
                status === 'error' ? 'bg-red-800 text-white' : ''
                }`}
            >
              {status === 'loading' && 'Sending...'}
              {status === 'success' && 'Message Sent ✓'}
              {status === 'error' && 'Error. Try Again.'}
              {status === 'idle' && 'Send Message'}
            </Button>
          </div>
        </form>
      </Card>

    </section >
  )
}

