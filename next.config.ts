import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const config: NextConfig = { reactStrictMode: true };
export default createNextIntlPlugin("./i18n/request.ts")(config);
