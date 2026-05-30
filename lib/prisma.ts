// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // In production we want a singleton instance to avoid exhausting connections.
  prisma = new PrismaClient();
} else {
  // In development we attach the client to the global object to preserve it across HMR.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalForPrisma = global as any;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
