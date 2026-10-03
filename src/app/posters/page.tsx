import type { Metadata } from "next";
import { PostersExperience } from "@/components/posters/exhibition";
import { posters } from "@/lib/posters";

export const metadata: Metadata = {
  title: "The Gallery — Poster Series",
  description:
    "The FILO Gallery: six original campaign posters, each set in the palette of the colourway it celebrates. Walk the wall and step closer.",
  alternates: { canonical: "/posters" },
};

export default function PostersPage() {
  return <PostersExperience posters={posters} />;
}
