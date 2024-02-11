
const { ENVIRONMENT, HOST_NAME, NODE_ENV } = process.env;
const config = {
  env: {
    ENVIRONMENT,
  },
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: [HOST_NAME]
  },
  output: "standalone"
}




export default config;