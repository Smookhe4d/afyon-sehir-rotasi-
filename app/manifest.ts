import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Afyon Şehir Rotası", short_name: "Şehir Rotası", start_url: "/", display: "standalone", background_color: "#FAF5EC", theme_color: "#0F2547", lang: "tr" };
}
