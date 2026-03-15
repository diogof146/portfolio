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

export default function Contact() {
  return (

    <section id="contact" className="py-24 max-w-7xl mx-auto px-6">

      <div className="mb-10 text-center md:text-left">
        <span className="text-primary font-semibold tracking-wider text-sm">Get in Touch</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Contact Me</h2>
      </div>

      <Card className="max-w-7xl mx-auto p-8 shadow-sm border-border/50 hover:shadow-md transition-all">


        <form className="w-full">

          <FieldSet className="w-full space-y-6">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" placeholder="Your Name"></Input>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" placeholder="Your Email"></Input>
              </Field>
              <Field>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <Input id="subject" placeholder="Subject"></Input>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea
                  id="message"
                  placeholder="Leave me a messsage..."
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
            <Button className="mt-4 bg-sidebar-accent-foreground">Clear</Button>
            <Button className="mt-4">Send Message</Button>
          </div>
        </form>
      </Card>

    </section >
  )
}
