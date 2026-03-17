import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {

    const body = await request.json();

    if (!body.name || !body.email || !body.subject || !body.message) {
      return Response.json("All fields must be filled", { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: `${body.name} <contact@diogof146.com>`,
      to: process.env.EMAIL,
      reply_to: body.email,
      subject: body.subject,
      text: body.message,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
