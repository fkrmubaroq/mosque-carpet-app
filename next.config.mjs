const { ENVIRONMENT, HOST_NAME } = process.env;
const config = {
  env: {
    ENVIRONMENT,
  },
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: [HOST_NAME]
  },
}

export default config;