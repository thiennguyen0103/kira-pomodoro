import { defineApiErrors, type ApiFailure } from "@/lib/http/api-response";

const duplicateNameMessage = "You already have an active skill with this name.";

const skillErrors = defineApiErrors({
  invalid_request: {
    status: 400,
    message: "Check the highlighted fields.",
  },
  duplicate: {
    status: 409,
    message: duplicateNameMessage,
  },
  not_found: {
    status: 404,
    message: "That skill does not exist.",
  },
  conflict: {
    status: 409,
    message: "This operation was already used for a different change.",
  },
  unavailable: {
    status: 503,
    message: "The skill could not be saved. Retry the same request.",
  },
});

export type SkillErrorCode = Parameters<typeof skillErrors.failure>[0];

export const duplicateNameField = {
  name: duplicateNameMessage,
};

export function skillFailure(
  code: SkillErrorCode,
  fields?: Record<string, string>,
): ApiFailure<SkillErrorCode> {
  const result = skillErrors.failure(code);

  if (!fields) {
    return result;
  }

  return {
    ...result,
    error: {
      ...result.error,
      fields,
    },
  };
}
