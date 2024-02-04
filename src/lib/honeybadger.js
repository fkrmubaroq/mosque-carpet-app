import Honeybadger from "@honeybadger-io/js";

export default function initHoneyBadger() {

  const config = {
    apiKey: process.env.HONEYBADGER_API_KEY,
    revision: process.env.HONEYBADGER_REVISION,
    environment: process.env.ENVIRONMENT,
    reportData: process.env.ENVIRONMENT !== "local",
    debug: process.env.ENVIRONMENT === "local",
    enableUnhandledRejection: false,
    developmentEnvironments: ["local"],
    enableUncaught: false,
    maxErrors: 201,
    // Limit the maximum number of errors the client will send to Honeybadger
    // after page load. Default is unlimited (undefined)
  };
  // https://docs.honeybadger.io/lib/javascript/reference/configuration.html
  Honeybadger.configure(config);

  if (process.env.ENVIRONMENT === "local" && typeof window !== "undefined") {
    window.Honeybadger = Honeybadger;
  }
}
