import tr from "@/messages/tr.json";
import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: tr.metadata.title, short_name: tr.metadata.shortName, start_url: "/", display: "standalone", background_color: "#FAF5EC", theme_color: "#0F2547", lang: "tr", description: tr.metadata.manifestDescription, icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" }, { src: "/apple-icon.png", sizes: "180x180", type: "image/png" }, { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }] };
}
