
const { ENVIRONMENT, HOST_NAME, NODE_ENV } = process.env;
const config = {
  env: {
    ENVIRONMENT,
    HOST_NAME,
  },
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: [HOST_NAME],
  },
};


export default config;