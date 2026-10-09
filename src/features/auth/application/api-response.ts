import {
  defineApiErrors,
  type ApiErrorBody,
  type ApiFailure,
  type ApiResult,
} from "@/lib/http/api-response";

export type { ApiResult };

const authErrors = defineApiErrors({
  unauthenticated: {
    status: 401,
    message: "Sign in to continue.",
  },
  invalid_request: {
    status: 400,
    message: "The request is invalid.",
  },
  redirect_rejected: {
    status: 400,
    message: "Redirect must stay on this application.",
  },
  auth_unavailable: {
    status: 500,
    message: "Authentication is unavailable. Try again.",
  },
});

export type AuthErrorCode = Parameters<typeof authErrors.failure>[0];

export type AuthFailure = ApiFailure<AuthErrorCode>;

export type AuthError = ApiErrorBody<AuthErrorCode>;

export const apiFailure = authErrors.failure;
