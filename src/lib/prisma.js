import { PrismaClient } from "@prisma/client";

const config = {
  errorFormat: "pretty",
  log: ["info", "query", "warn", "error"]
}

let prismaClient

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient(config)
} else {
  if (!global.prismaClient) {
    global.prismaClient = new PrismaClient(config)
  }

  prismaClient = global.prismaClient
}

export { prismaClient };
