"use client";

import NextImage, { type ImageProps } from "next/image";
import { isShopifyImage, shopifyLoader } from "@/lib/image-loader";

/** next/image that lets Shopify's CDN do the resizing for catalog photos. */
export default function Image(props: ImageProps) {
  return <NextImage {...props} loader={isShopifyImage(props.src) ? shopifyLoader : undefined} />;
}
