import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   i18n: {
//     locales: ['en', 'mr'], // English and Marathi
//     defaultLocale: 'en',
//   },
// };

// export default nextConfig;

// const { i18n } = require('./next-i18next.config')
import { i18n } from './next-i18next.config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
}

module.exports = nextConfig