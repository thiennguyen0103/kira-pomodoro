import "dotenv/config";

import prisma from "../src/lib/prisma";

async function testDatabase() {
  try {
    const rows = await prisma.$queryRaw`SELECT 1 AS ok`;
    console.log("Database connection ok", rows);
  } catch {
    console.error("Database connection failed.");
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void testDatabase();
