import { afterAll, beforeAll, expect, it } from "vitest";

import prisma from "@/lib/prisma";

const runId = crypto.randomUUID();
const ownerAId = `kpo22-a-${runId}`;
const ownerBId = `kpo22-b-${runId}`;

function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }

  return error.code === "P2002" || error.code === "23505";
}

beforeAll(async () => {
  await prisma.user.createMany({
    data: [
      {
        id: ownerAId,
        name: "Owner A",
        email: `${ownerAId}@example.com`,
      },
      {
        id: ownerBId,
        name: "Owner B",
        email: `${ownerBId}@example.com`,
      },
    ],
  });
});

afterAll(async () => {
  await prisma.skill.deleteMany({
    where: { ownerId: { in: [ownerAId, ownerBId] } },
  });
  await prisma.session.deleteMany({
    where: { userId: { in: [ownerAId, ownerBId] } },
  });
  await prisma.user.deleteMany({
    where: { id: { in: [ownerAId, ownerBId] } },
  });
  await prisma.$disconnect();
});

it("enforces one active normalized name per owner in the database", async () => {
  const index = await prisma.$queryRaw<Array<{ indexdef: string }>>`
    SELECT pg_get_indexdef(indexrelid) AS indexdef
    FROM pg_index
    JOIN pg_class ON pg_class.oid = pg_index.indexrelid
    WHERE pg_class.relname = 'skill_active_owner_normalized_name_key'
  `;

  expect(index).toHaveLength(1);
  expect(index[0]?.indexdef).toContain("UNIQUE");
  expect(index[0]?.indexdef).toContain("archivedAt");
  expect(index[0]?.indexdef.toUpperCase()).toContain("IS NULL");

  await prisma.skill.create({
    data: {
      ownerId: ownerAId,
      name: "Piano",
      normalizedName: "piano",
      goalHours: 100,
    },
  });

  await expect(
    prisma.skill.create({
      data: {
        ownerId: ownerAId,
        name: "PIANO",
        normalizedName: "piano",
        goalHours: 40,
      },
    }),
  ).rejects.toSatisfy(isUniqueViolation);
});

it("lets only one of two concurrent active creates commit", async () => {
  const results = await Promise.allSettled([
    prisma.skill.create({
      data: {
        ownerId: ownerAId,
        name: "Violin",
        normalizedName: "violin",
        goalHours: 100,
      },
    }),
    prisma.skill.create({
      data: {
        ownerId: ownerAId,
        name: "violin",
        normalizedName: "violin",
        goalHours: 80,
      },
    }),
  ]);

  const committed = results.filter((result) => result.status === "fulfilled");
  const rejected = results.filter((result) => result.status === "rejected");

  expect(committed).toHaveLength(1);
  expect(rejected).toHaveLength(1);
  expect(rejected[0]?.status).toBe("rejected");
  if (rejected[0]?.status === "rejected") {
    expect(isUniqueViolation(rejected[0].reason)).toBe(true);
  }
});

it("allows the same active name for a different owner", async () => {
  const skill = await prisma.skill.create({
    data: {
      ownerId: ownerBId,
      name: "Piano",
      normalizedName: "piano",
      goalHours: 25,
    },
  });

  expect(skill.ownerId).toBe(ownerBId);
  expect(skill.normalizedName).toBe("piano");
});

it("reuses an archived name and keeps the archived skill", async () => {
  const session = await prisma.session.create({
    data: {
      id: `kpo22-session-${runId}`,
      token: `kpo22-token-${runId}`,
      expiresAt: new Date("2026-12-01T00:00:00.000Z"),
      userId: ownerAId,
    },
  });

  const original = await prisma.skill.create({
    data: {
      ownerId: ownerAId,
      name: "Cello",
      normalizedName: "cello",
      goalHours: 100,
    },
  });

  const archived = await prisma.skill.update({
    where: { id: original.id },
    data: { archivedAt: new Date("2026-10-12T09:00:00.000Z") },
  });

  const reused = await prisma.skill.create({
    data: {
      ownerId: ownerAId,
      name: "Cello",
      normalizedName: "cello",
      goalHours: 120,
    },
  });

  const retained = await prisma.skill.findUniqueOrThrow({
    where: { id: archived.id },
  });
  const retainedSession = await prisma.session.findUniqueOrThrow({
    where: { id: session.id },
  });
  const relations = await prisma.$queryRaw<Array<{ conname: string }>>`
    SELECT conname
    FROM pg_constraint
    WHERE conname IN ('session_userId_fkey', 'account_userId_fkey', 'skill_ownerId_fkey')
  `;

  expect(reused.id).not.toBe(retained.id);
  expect(retained.archivedAt).not.toBeNull();
  expect(retained.name).toBe("Cello");
  expect(retained.goalHours).toBe(100);
  expect(retained.ownerId).toBe(ownerAId);
  expect(retainedSession.userId).toBe(ownerAId);
  expect(relations.map((relation) => relation.conname).sort()).toEqual([
    "account_userId_fkey",
    "session_userId_fkey",
    "skill_ownerId_fkey",
  ]);
});
