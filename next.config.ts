import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'mr'], // English and Marathi
    defaultLocale: 'en',
  },
};

export default nextConfig;
