import path from "path";
import { fileURLToPath } from 'url';
const { ENVIRONMENT } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const config = {
  env: {
    ENVIRONMENT,
  },
  swcMinify: false,
  reactStrictMode: true,
  sassOptions: {
    fiber: false,
    includePaths: [path.join(__dirname, 'styles')],
  },
}

export default config;