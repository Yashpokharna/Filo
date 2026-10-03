import "server-only";
import { site } from "@/lib/site";

/**
 * Sends store notifications through Resend's REST API. Configure
 * RESEND_API_KEY (and optionally MAIL_FROM / MAIL_TO) to enable; without
 * them, forms fall back to opening the shopper's email app.
 */
export const mailerConfigured = () => Boolean(process.env.RESEND_API_KEY);

export async function sendMail({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? `Filo Website <website@filoclothing.com>`,
      to: [process.env.MAIL_TO ?? site.email],
      reply_to: replyTo,
      subject,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export const isEmail = (v: unknown): v is string =>
  typeof v === "string" && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
