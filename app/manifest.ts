import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Afyon Şehir Rotası", short_name: "Şehir Rotası", start_url: "/", display: "standalone", background_color: "#FAF5EC", theme_color: "#0F2547", lang: "tr", description: "Afyonkarahisar için rehberli rotalar, sesli anlatım ve canlı harita.", icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" }, { src: "/apple-icon.png", sizes: "180x180", type: "image/png" }] };
}
