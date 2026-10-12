import "server-only";

import { apiFailure } from "@/features/auth/application/api-response";
import { db } from "@/lib/db";
import type { ApiResult } from "@/lib/http/api-response";

import {
  parseCreateSkill,
  parseUpdateSkill,
  toSkillDto,
  type CreateSkillInput,
  type SkillDto,
  type SkillRecord,
  type UpdateSkillInput,
} from "../domain/skill";
import { duplicateNameField, skillFailure } from "./skill-errors";

type OperationKey = {
  ownerId_operationId: {
    ownerId: string;
    operationId: string;
  };
};

export async function listSkills(
  actorId: string | null,
): Promise<ApiResult<SkillDto[]>> {
  if (!actorId) {
    return apiFailure("unauthenticated");
  }

  const skills = await db.skill.findMany({
    where: { ownerId: actorId, archivedAt: null },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
  const credited = await creditedSecondsFor(skills.map((skill) => skill.id));

  return {
    ok: true,
    status: 200,
    data: skills.map((skill) => toSkillDto(skill, credited.get(skill.id) ?? 0)),
  };
}

export async function createSkill(
  actorId: string | null,
  input: unknown,
): Promise<ApiResult<SkillDto>> {
  if (!actorId) {
    return apiFailure("unauthenticated");
  }

  const parsed = parseCreateSkill(input);

  if (!parsed.ok) {
    return skillFailure("invalid_request", parsed.fields);
  }

  const payload = createPayload(parsed.value);

  try {
    const outcome = await db.$transaction(async (tx) => {
      const existing = await tx.skillOperation.findUnique({
        where: operationKey(actorId, parsed.value.operationId),
      });

      if (existing) {
        return { kind: "existing" as const };
      }

      const skill = await tx.skill.create({
        data: {
          ownerId: actorId,
          name: parsed.value.name,
          normalizedName: parsed.value.normalizedName,
          goalHours: parsed.value.goalHours,
        },
      });

      await tx.skillOperation.create({
        data: {
          ownerId: actorId,
          operationId: parsed.value.operationId,
          skillId: skill.id,
          payload,
        },
      });

      return { kind: "created" as const, skill };
    });

    if (outcome.kind === "existing") {
      return replayOperation(actorId, parsed.value.operationId, payload, 201);
    }

    return { ok: true, status: 201, data: await dtoFor(outcome.skill) };
  } catch (error) {
    if (!isUniqueViolation(error)) {
      console.error("Skill create failed.");
      return skillFailure("unavailable");
    }

    return replayOperation(actorId, parsed.value.operationId, payload, 201);
  }
}

export async function updateSkill(
  actorId: string | null,
  input: unknown,
): Promise<ApiResult<SkillDto>> {
  if (!actorId) {
    return apiFailure("unauthenticated");
  }

  const parsed = parseUpdateSkill(input);

  if (!parsed.ok) {
    return skillFailure("invalid_request", parsed.fields);
  }

  const payload = updatePayload(parsed.value);

  try {
    const outcome = await db.$transaction(async (tx) => {
      const existing = await tx.skillOperation.findUnique({
        where: operationKey(actorId, parsed.value.operationId),
      });

      if (existing) {
        return { kind: "existing" as const };
      }

      const current = await tx.skill.findFirst({
        where: {
          id: parsed.value.skillId,
          ownerId: actorId,
          archivedAt: null,
        },
      });

      if (!current) {
        return { kind: "missing" as const };
      }

      const saved = await tx.skill.updateMany({
        where: { id: current.id, ownerId: actorId, archivedAt: null },
        data: {
          name: parsed.value.name ?? current.name,
          normalizedName: parsed.value.normalizedName ?? current.normalizedName,
          goalHours: parsed.value.goalHours ?? current.goalHours,
        },
      });

      if (saved.count !== 1) {
        return { kind: "missing" as const };
      }

      await tx.skillOperation.create({
        data: {
          ownerId: actorId,
          operationId: parsed.value.operationId,
          skillId: current.id,
          payload,
        },
      });

      const skill = await tx.skill.findFirst({
        where: { id: current.id, ownerId: actorId },
      });

      if (!skill) {
        return { kind: "missing" as const };
      }

      return { kind: "updated" as const, skill };
    });

    if (outcome.kind === "missing") {
      return skillFailure("not_found");
    }

    if (outcome.kind === "existing") {
      return replayOperation(actorId, parsed.value.operationId, payload, 200);
    }

    return { ok: true, status: 200, data: await dtoFor(outcome.skill) };
  } catch (error) {
    if (!isUniqueViolation(error)) {
      console.error("Skill update failed.");
      return skillFailure("unavailable");
    }

    return replayOperation(actorId, parsed.value.operationId, payload, 200);
  }
}

function operationKey(ownerId: string, operationId: string): OperationKey {
  return { ownerId_operationId: { ownerId, operationId } };
}

function createPayload(input: CreateSkillInput): string {
  return JSON.stringify({
    action: "create",
    name: input.name,
    goalHours: input.goalHours,
  });
}

function updatePayload(input: UpdateSkillInput): string {
  return JSON.stringify({
    action: "update",
    skillId: input.skillId,
    name: input.name ?? null,
    goalHours: input.goalHours ?? null,
  });
}

async function replayOperation(
  actorId: string,
  operationId: string,
  payload: string,
  status: 200 | 201,
): Promise<ApiResult<SkillDto>> {
  const operation = await db.skillOperation.findUnique({
    where: operationKey(actorId, operationId),
  });

  if (!operation) {
    return skillFailure("duplicate", duplicateNameField);
  }

  if (operation.payload !== payload) {
    return skillFailure("conflict");
  }

  const skill = await db.skill.findFirst({
    where: { id: operation.skillId, ownerId: actorId },
  });

  if (!skill) {
    return skillFailure("not_found");
  }

  return { ok: true, status, data: await dtoFor(skill) };
}

async function dtoFor(skill: SkillRecord): Promise<SkillDto> {
  const credited = await creditedSecondsFor([skill.id]);
  return toSkillDto(skill, credited.get(skill.id) ?? 0);
}

// Focus contributions arrive with the timer stories. Until then every skill has 0 credited seconds.
async function creditedSecondsFor(
  skillIds: string[],
): Promise<Map<string, number>> {
  return new Map(skillIds.map((skillId) => [skillId, 0]));
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}
