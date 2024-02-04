const { ENVIRONMENT } = process.env;
const config = {
  env: {
    ENVIRONMENT,
  },
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ["localhost"]
  },
}

export default config;