import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/auth/", "/giris", "/en/sign-in"] }, sitemap: "https://rotafyon.vercel.app/sitemap.xml" };
}
