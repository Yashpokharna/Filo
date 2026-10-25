import type { Metadata } from "next";
import { PostersExperience } from "@/components/posters/exhibition";
import { getPosters } from "@/lib/posters";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "The Gallery — Poster Series",
  description:
    "The FILO Gallery: six original campaign posters, each set in the palette of the colourway it celebrates. Walk the wall and step closer.",
  alternates: { canonical: "/posters" },
};

export default async function PostersPage() {
  return <PostersExperience posters={await getPosters()} />;
}
