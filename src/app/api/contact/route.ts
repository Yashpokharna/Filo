import { isEmail, mailerConfigured, sendMail } from "@/lib/mailer";

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid request" }, { status: 400 });

  // Honeypot: real visitors never fill the hidden "company" field.
  if (clip(body.company, 100)) return Response.json({ ok: true });

  const kind = body.kind === "newsletter" ? "newsletter" : "contact";
  const email = clip(body.email, 254);
  if (!isEmail(email)) return Response.json({ error: "Please enter a valid email." }, { status: 422 });

  if (!mailerConfigured()) return Response.json({ fallback: true }, { status: 503 });

  try {
    if (kind === "newsletter") {
      await sendMail({ subject: `New newsletter sign-up: ${email}`, text: `Subscribe ${email} to the FILO list.`, replyTo: email });
    } else {
      const name = clip(body.name, 120);
      const phone = clip(body.phone, 40);
      const message = clip(body.message, 5000);
      if (!message) return Response.json({ error: "Please add a message." }, { status: 422 });
      await sendMail({
        subject: `Website enquiry from ${name || email}`,
        text: `Name: ${name || "—"}\nEmail: ${email}\nPhone: ${phone || "—"}\n\n${message}`,
        replyTo: email,
      });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return Response.json({ fallback: true }, { status: 502 });
  }
}
