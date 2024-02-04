const { ENVIRONMENT } = process.env;

module.exports = {
  env: {
    ENVIRONMENT,
  },
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ["localhost"]
  },
}