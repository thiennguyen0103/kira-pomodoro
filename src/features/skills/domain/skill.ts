import { z } from "zod";

export const suggestedSkillGoalHours = 100;

const nameMessage = "Enter a name from 1 to 80 characters.";
const goalHoursMessage = "Enter a whole number of hours from 1 to 10000.";
const operationIdMessage = "Enter a valid operation id.";
const skillIdMessage = "Enter a skill id.";
const rejectedFieldMessage = "This field is not accepted.";
const emptyUpdateMessage = "Enter a name or a goal.";

const skillNameSchema = z
  .string({ error: nameMessage })
  .trim()
  .min(1, { error: nameMessage })
  .max(80, { error: nameMessage });

const goalHoursSchema = z
  .number({ error: goalHoursMessage })
  .int({ error: goalHoursMessage })
  .min(1, { error: goalHoursMessage })
  .max(10000, { error: goalHoursMessage });

const operationIdSchema = z
  .string({ error: operationIdMessage })
  .uuid({ error: operationIdMessage });

const createSkillSchema = z
  .object({
    name: skillNameSchema,
    goalHours: goalHoursSchema.optional().default(suggestedSkillGoalHours),
    operationId: operationIdSchema,
  })
  .strict();

const updateSkillSchema = z
  .object({
    skillId: z
      .string({ error: skillIdMessage })
      .uuid({ error: skillIdMessage }),
    operationId: operationIdSchema,
    name: skillNameSchema.optional(),
    goalHours: goalHoursSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.name === undefined && value.goalHours === undefined) {
      context.addIssue({
        code: "custom",
        message: emptyUpdateMessage,
        path: ["name"],
      });
    }
  });

export type CreateSkillInput = {
  name: string;
  normalizedName: string;
  goalHours: number;
  operationId: string;
};

export type UpdateSkillInput = {
  skillId: string;
  operationId: string;
  name?: string;
  normalizedName?: string;
  goalHours?: number;
};

export type SkillFieldErrors = Record<string, string>;

export type SkillRecord = {
  id: string;
  name: string;
  goalHours: number;
  archivedAt: Date | null;
};

export type SkillDto = {
  id: string;
  name: string;
  goalHours: number;
  creditedSeconds: number;
  achieved: boolean;
  progressPercent: number;
  archivedAt: string | null;
};

type ParseSuccess<Value> = { ok: true; value: Value };
type ParseFailure = { ok: false; fields: SkillFieldErrors };

export function normalizeSkillName(name: string): string {
  return name.trim().toLowerCase();
}

export function parseCreateSkill(
  input: unknown,
): ParseSuccess<CreateSkillInput> | ParseFailure {
  const parsed = createSkillSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, fields: fieldsFromZod(parsed.error) };
  }

  return {
    ok: true,
    value: {
      name: parsed.data.name,
      normalizedName: normalizeSkillName(parsed.data.name),
      goalHours: parsed.data.goalHours,
      operationId: parsed.data.operationId,
    },
  };
}

export function parseUpdateSkill(
  input: unknown,
): ParseSuccess<UpdateSkillInput> | ParseFailure {
  const parsed = updateSkillSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, fields: fieldsFromZod(parsed.error) };
  }

  const value: UpdateSkillInput = {
    skillId: parsed.data.skillId,
    operationId: parsed.data.operationId,
  };

  if (parsed.data.name !== undefined) {
    value.name = parsed.data.name;
    value.normalizedName = normalizeSkillName(parsed.data.name);
  }

  if (parsed.data.goalHours !== undefined) {
    value.goalHours = parsed.data.goalHours;
  }

  return { ok: true, value };
}

export function toSkillDto(
  skill: SkillRecord,
  creditedSeconds: number,
): SkillDto {
  const goalSeconds = skill.goalHours * 3600;
  const achieved = creditedSeconds >= goalSeconds;
  const progressPercent = Math.min(100, (creditedSeconds / goalSeconds) * 100);

  return {
    id: skill.id,
    name: skill.name,
    goalHours: skill.goalHours,
    creditedSeconds,
    achieved,
    progressPercent,
    archivedAt: skill.archivedAt ? skill.archivedAt.toISOString() : null,
  };
}

function fieldsFromZod(error: z.ZodError): SkillFieldErrors {
  const fields: SkillFieldErrors = {};

  for (const issue of error.issues) {
    const unrecognized = /^Unrecognized key: "(.+)"$/.exec(issue.message);
    const key = unrecognized?.[1] ?? issue.path[0];

    if (typeof key !== "string" || key in fields) {
      continue;
    }

    fields[key] = unrecognized ? rejectedFieldMessage : issue.message;
  }

  return fields;
}
