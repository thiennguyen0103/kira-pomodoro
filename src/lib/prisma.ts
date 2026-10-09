import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

function postgresConfig(connectionString: string | undefined) {
  if (!connectionString) {
    return { connectionString };
  }

  const url = new URL(connectionString);
  const sslMode = url.searchParams.get("sslmode");
  const localHost =
    url.hostname === "localhost" || url.hostname === "127.0.0.1";

  url.searchParams.delete("sslmode");

  if (!sslMode || sslMode === "disable") {
    return { connectionString: url.toString() };
  }

  // node-postgres treats sslmode=require as full certificate verification.
  // Local Postgres uses a self-signed certificate.
  return {
    connectionString: url.toString(),
    ssl: {
      rejectUnauthorized: !localHost,
    },
  };
}

const adapter = new PrismaPg(postgresConfig(process.env.DATABASE_URL));

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
