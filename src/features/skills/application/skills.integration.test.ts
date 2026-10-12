import { afterAll, beforeAll, expect, it } from "vitest";

import prisma from "@/lib/prisma";

import { createSkill, listSkills, updateSkill } from "./skills";

const runId = crypto.randomUUID();
const ownerAId = `kpo23-a-${runId}`;
const ownerBId = `kpo23-b-${runId}`;

beforeAll(async () => {
  await prisma.user.createMany({
    data: [
      { id: ownerAId, name: "Owner A", email: `${ownerAId}@example.com` },
      { id: ownerBId, name: "Owner B", email: `${ownerBId}@example.com` },
    ],
  });
});

afterAll(async () => {
  await prisma.skillOperation.deleteMany({
    where: { ownerId: { in: [ownerAId, ownerBId] } },
  });
  await prisma.skill.deleteMany({
    where: { ownerId: { in: [ownerAId, ownerBId] } },
  });
  await prisma.user.deleteMany({
    where: { id: { in: [ownerAId, ownerBId] } },
  });
  await prisma.$disconnect();
});

it("rejects an anonymous create before writing a skill", async () => {
  const result = await createSkill(null, {
    name: "Piano",
    goalHours: 100,
    operationId: crypto.randomUUID(),
  });

  expect(result).toMatchObject({
    ok: false,
    status: 401,
    error: { code: "unauthenticated" },
  });
  expect(await skillCount(ownerAId)).toBe(0);
});

it("returns field errors and does not save an invalid skill", async () => {
  const result = await createSkill(ownerAId, {
    name: "   ",
    goalHours: 0,
    operationId: crypto.randomUUID(),
  });

  expect(result).toMatchObject({
    ok: false,
    status: 400,
    error: {
      code: "invalid_request",
      fields: {
        name: "Enter a name from 1 to 80 characters.",
        goalHours: "Enter a whole number of hours from 1 to 10000.",
      },
    },
  });
  expect(await skillCount(ownerAId)).toBe(0);
});

it("creates an active skill with the suggested goal and lists only that owner's skills", async () => {
  const operationId = crypto.randomUUID();
  const created = await createSkill(ownerAId, {
    name: "  Piano  ",
    operationId,
  });
  const listed = await listSkills(ownerAId);
  const otherList = await listSkills(ownerBId);

  expect(created).toMatchObject({
    ok: true,
    status: 201,
    data: {
      name: "Piano",
      goalHours: 100,
      creditedSeconds: 0,
      achieved: false,
      progressPercent: 0,
      archivedAt: null,
    },
  });
  expect(listed).toMatchObject({
    ok: true,
    data: [created.ok ? created.data : {}],
  });
  expect(otherList).toEqual({ ok: true, status: 200, data: [] });
});

it("rejects a duplicate active name with a name field error", async () => {
  const result = await createSkill(ownerAId, {
    name: "PIANO",
    goalHours: 40,
    operationId: crypto.randomUUID(),
  });

  expect(result).toMatchObject({
    ok: false,
    status: 409,
    error: {
      code: "duplicate",
      fields: { name: "You already have an active skill with this name." },
    },
  });
  expect(await skillCount(ownerAId)).toBe(1);
});

it("lets only one of two concurrent creates with the same name commit", async () => {
  const results = await Promise.all([
    createSkill(ownerAId, {
      name: "Violin",
      goalHours: 10,
      operationId: crypto.randomUUID(),
    }),
    createSkill(ownerAId, {
      name: "violin",
      goalHours: 12,
      operationId: crypto.randomUUID(),
    }),
  ]);
  const saved = results.filter((result) => result.ok);
  const rejected = results.filter((result) => !result.ok);

  expect(saved).toHaveLength(1);
  expect(rejected).toHaveLength(1);
  expect(rejected[0]).toMatchObject({
    ok: false,
    error: { code: "duplicate", fields: { name: expect.any(String) } },
  });
});

it("returns the same skill when a create is retried with the same operation id", async () => {
  const operationId = crypto.randomUUID();
  const input = { name: "Cello", goalHours: 80, operationId };
  const first = await createSkill(ownerAId, input);
  const second = await createSkill(ownerAId, input);

  expect(first.ok).toBe(true);
  expect(second.ok).toBe(true);
  if (first.ok && second.ok) {
    expect(second.data.id).toBe(first.data.id);
  }
  expect(
    await prisma.skill.count({
      where: { ownerId: ownerAId, normalizedName: "cello" },
    }),
  ).toBe(1);
});

it("does not apply a different create that reuses an operation id", async () => {
  const operationId = crypto.randomUUID();
  const first = await createSkill(ownerBId, {
    name: "Harp",
    goalHours: 15,
    operationId,
  });
  const second = await createSkill(ownerBId, {
    name: "Organ",
    goalHours: 15,
    operationId,
  });

  expect(first.ok).toBe(true);
  expect(second).toMatchObject({
    ok: false,
    status: 409,
    error: { code: "conflict" },
  });
  expect(
    await prisma.skill.count({
      where: { ownerId: ownerBId, normalizedName: "organ" },
    }),
  ).toBe(0);
});

it("allows another owner to use the same active name", async () => {
  const created = await createSkill(ownerBId, {
    name: "Piano",
    goalHours: 25,
    operationId: crypto.randomUUID(),
  });

  expect(created).toMatchObject({
    ok: true,
    data: { name: "Piano", goalHours: 25 },
  });
});

it("hides another account's skill id", async () => {
  const owned = await prisma.skill.findFirstOrThrow({
    where: { ownerId: ownerAId, normalizedName: "piano" },
  });
  const result = await updateSkill(ownerBId, {
    skillId: owned.id,
    name: "Stolen",
    operationId: crypto.randomUUID(),
  });
  const unchanged = await prisma.skill.findUniqueOrThrow({
    where: { id: owned.id },
  });

  expect(result).toMatchObject({
    ok: false,
    status: 404,
    error: { code: "not_found" },
  });
  expect(unchanged.name).toBe("Piano");
});

it("edits the goal without changing the name or credited time", async () => {
  const owned = await prisma.skill.findFirstOrThrow({
    where: { ownerId: ownerAId, normalizedName: "piano" },
  });
  const result = await updateSkill(ownerAId, {
    skillId: owned.id,
    goalHours: 40,
    operationId: crypto.randomUUID(),
  });
  const saved = await prisma.skill.findUniqueOrThrow({
    where: { id: owned.id },
  });

  expect(result).toMatchObject({
    ok: true,
    data: {
      id: owned.id,
      name: "Piano",
      goalHours: 40,
      creditedSeconds: 0,
      achieved: false,
      progressPercent: 0,
    },
  });
  expect(saved.name).toBe(owned.name);
  expect(saved.normalizedName).toBe(owned.normalizedName);
  expect(saved.createdAt).toEqual(owned.createdAt);
  expect(saved.goalHours).toBe(40);
});

it("rejects client-supplied credited seconds and leaves the skill unchanged", async () => {
  const owned = await prisma.skill.findFirstOrThrow({
    where: { ownerId: ownerAId, normalizedName: "piano" },
  });
  const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'skill' AND column_name = 'creditedSeconds'
  `;
  const result = await updateSkill(ownerAId, {
    skillId: owned.id,
    goalHours: 80,
    creditedSeconds: 999,
    operationId: crypto.randomUUID(),
  });
  const saved = await prisma.skill.findUniqueOrThrow({
    where: { id: owned.id },
  });

  expect(columns).toEqual([]);
  expect(result).toMatchObject({
    ok: false,
    error: {
      code: "invalid_request",
      fields: { creditedSeconds: expect.any(String) },
    },
  });
  expect(saved.goalHours).toBe(owned.goalHours);
});

it("renames a skill and rejects a rename onto another active name", async () => {
  const piano = await prisma.skill.findFirstOrThrow({
    where: { ownerId: ownerAId, normalizedName: "piano" },
  });
  const renamed = await updateSkill(ownerAId, {
    skillId: piano.id,
    name: "  Grand Piano  ",
    operationId: crypto.randomUUID(),
  });
  const duplicate = await updateSkill(ownerAId, {
    skillId: piano.id,
    name: "Violin",
    operationId: crypto.randomUUID(),
  });
  const saved = await prisma.skill.findUniqueOrThrow({
    where: { id: piano.id },
  });

  expect(renamed).toMatchObject({
    ok: true,
    data: { name: "Grand Piano", goalHours: piano.goalHours },
  });
  expect(duplicate).toMatchObject({
    ok: false,
    error: { code: "duplicate", fields: { name: expect.any(String) } },
  });
  expect(saved.name).toBe("Grand Piano");
  expect(saved.normalizedName).toBe("grand piano");
  expect(saved.goalHours).toBe(piano.goalHours);
});

it("omits an archived skill from the list and from edits", async () => {
  const cello = await prisma.skill.findFirstOrThrow({
    where: { ownerId: ownerAId, normalizedName: "cello" },
  });
  await prisma.skill.update({
    where: { id: cello.id },
    data: { archivedAt: new Date("2026-10-12T09:00:00.000Z") },
  });

  const listed = await listSkills(ownerAId);
  const edited = await updateSkill(ownerAId, {
    skillId: cello.id,
    goalHours: 90,
    operationId: crypto.randomUUID(),
  });
  const saved = await prisma.skill.findUniqueOrThrow({
    where: { id: cello.id },
  });

  expect(listed.ok).toBe(true);
  if (listed.ok) {
    expect(listed.data.map((skill) => skill.id)).not.toContain(cello.id);
  }
  expect(edited).toMatchObject({
    ok: false,
    status: 404,
    error: { code: "not_found" },
  });
  expect(saved.goalHours).toBe(cello.goalHours);
  expect(saved.archivedAt).not.toBeNull();
});

async function skillCount(ownerId: string): Promise<number> {
  return prisma.skill.count({ where: { ownerId } });
}
