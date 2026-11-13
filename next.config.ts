import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const config: NextConfig = {
  reactStrictMode: true,
  // G-017: eski adres (Afyon Şehir Rotası) her yolda kalıcı olarak yeni adrese yönlenir.
  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: "afyon-sehir-rotasi.vercel.app" }], destination: "https://rotafyon.vercel.app/:path*", permanent: true }];
  },
};
export default createNextIntlPlugin("./i18n/request.ts")(config);
