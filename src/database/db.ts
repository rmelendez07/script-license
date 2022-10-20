import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

type GlobalThisWithPrismaClient = typeof global & { db?: PrismaClient };

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  const newGlobalThis = global as GlobalThisWithPrismaClient;
  if (!newGlobalThis.db) {
    newGlobalThis.db = new PrismaClient();
  }
  prisma = newGlobalThis.db;
}

export default prisma;
