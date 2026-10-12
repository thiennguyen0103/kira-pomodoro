import { describe, expect, it } from "vitest";

import {
  normalizeSkillName,
  parseCreateSkill,
  parseUpdateSkill,
  suggestedSkillGoalHours,
  toSkillDto,
} from "./skill";

const operationId = "8d0c9b6e-2a4f-4e1c-9b7a-1f2e3d4c5b6a";

describe("normalizeSkillName", () => {
  it("trims outer whitespace and lowercases Unicode letters", () => {
    expect(normalizeSkillName("  Piano  ")).toBe("piano");
    expect(normalizeSkillName("Ωmega")).toBe("ωmega");
  });
});

describe("parseCreateSkill", () => {
  it("trims the name and uses the suggested goal when hours are omitted", () => {
    expect(
      parseCreateSkill({
        name: "  Piano  ",
        operationId,
      }),
    ).toEqual({
      ok: true,
      value: {
        name: "Piano",
        normalizedName: "piano",
        goalHours: suggestedSkillGoalHours,
        operationId,
      },
    });
    expect(suggestedSkillGoalHours).toBe(100);
  });

  it("rejects blank, overlong, and non-integer goals with field errors", () => {
    expect(
      parseCreateSkill({
        name: "   ",
        goalHours: 1.5,
        operationId,
        creditedSeconds: 999,
      }),
    ).toEqual({
      ok: false,
      fields: {
        name: "Enter a name from 1 to 80 characters.",
        goalHours: "Enter a whole number of hours from 1 to 10000.",
        creditedSeconds: "This field is not accepted.",
      },
    });
  });

  it("rejects a name longer than 80 characters", () => {
    const parsed = parseCreateSkill({
      name: "p".repeat(81),
      goalHours: 100,
      operationId,
    });

    expect(parsed).toMatchObject({
      ok: false,
      fields: { name: "Enter a name from 1 to 80 characters." },
    });
  });
});

describe("parseUpdateSkill", () => {
  it("accepts a goal change without a new name", () => {
    expect(
      parseUpdateSkill({
        skillId: operationId,
        goalHours: 40,
        operationId,
      }),
    ).toEqual({
      ok: true,
      value: {
        skillId: operationId,
        operationId,
        goalHours: 40,
      },
    });
  });

  it("rejects an update that changes nothing", () => {
    expect(
      parseUpdateSkill({
        skillId: operationId,
        operationId,
      }),
    ).toEqual({
      ok: false,
      fields: { name: "Enter a name or a goal." },
    });
  });
});

describe("toSkillDto", () => {
  const skill = {
    id: "skill-1",
    name: "Piano",
    goalHours: 1,
    archivedAt: null,
  };

  it("derives progress from server credited seconds", () => {
    expect(toSkillDto(skill, 1800)).toEqual({
      id: "skill-1",
      name: "Piano",
      goalHours: 1,
      creditedSeconds: 1800,
      achieved: false,
      progressPercent: 50,
      archivedAt: null,
    });
  });

  it("caps progress at 100 percent when the goal is already met", () => {
    expect(toSkillDto({ ...skill, goalHours: 1 }, 7200)).toMatchObject({
      creditedSeconds: 7200,
      achieved: true,
      progressPercent: 100,
    });
  });
});
