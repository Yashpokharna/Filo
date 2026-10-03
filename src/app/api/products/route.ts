import { getSummaries } from "@/lib/catalog";

export const revalidate = 900;

/** Lightweight catalog index for client-side search. */
export async function GET() {
  return Response.json(await getSummaries());
}
