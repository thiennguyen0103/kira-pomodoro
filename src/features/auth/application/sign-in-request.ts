import { z } from "zod";

import { isSafeRedirect } from "../domain/redirect";
import { apiFailure, type ApiResult } from "./api-response";

const signInSchema = z
  .object({
    callbackURL: z.string().optional(),
    errorCallbackURL: z.string().optional(),
    newUserCallbackURL: z.string().optional(),
  })
  .strict();

export type GoogleSignInInput = z.infer<typeof signInSchema>;

export function parseGoogleSignIn(
  body: unknown,
  appOrigin: string,
): ApiResult<GoogleSignInInput> {
  const parsed = signInSchema.safeParse(body);

  if (!parsed.success) {
    return apiFailure("invalid_request");
  }

  const destinations = [
    parsed.data.callbackURL,
    parsed.data.errorCallbackURL,
    parsed.data.newUserCallbackURL,
  ];

  if (
    destinations.some(
      (destination) => destination && !isSafeRedirect(destination, appOrigin),
    )
  ) {
    return apiFailure("redirect_rejected");
  }

  return {
    ok: true,
    status: 200,
    data: {
      callbackURL: parsed.data.callbackURL ?? "/",
      errorCallbackURL: parsed.data.errorCallbackURL,
      newUserCallbackURL: parsed.data.newUserCallbackURL,
    },
  };
}
