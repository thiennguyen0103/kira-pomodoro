export type ApiErrorBody<Code extends string = string> = {
  code: Code;
  message: string;
};

export type ApiSuccess<Data> = {
  ok: true;
  status: number;
  data: Data;
};

export type ApiFailure<Code extends string = string> = {
  ok: false;
  status: number;
  error: ApiErrorBody<Code>;
};

export type ApiResult<Data, Code extends string = string> =
  | ApiSuccess<Data>
  | ApiFailure<Code>;

export type ApiErrorDefinition = {
  status: number;
  message: string;
};

export function apiSuccess<Data>(data: Data, status = 200): ApiSuccess<Data> {
  return { ok: true, status, data };
}

export function apiError<Code extends string>(
  code: Code,
  status: number,
  message: string,
): ApiFailure<Code> {
  return {
    ok: false,
    status,
    error: { code, message },
  };
}

export function defineApiErrors<
  const Definitions extends Record<string, ApiErrorDefinition>,
>(definitions: Definitions) {
  type Code = Extract<keyof Definitions, string>;

  function failure(code: Code): ApiFailure<Code> {
    const definition = definitions[code];

    if (!definition) {
      throw new Error(`Unknown API error code: ${code}`);
    }

    return apiError(code, definition.status, definition.message);
  }

  return { failure };
}

export function jsonResult<Data, Code extends string>(
  result: ApiResult<Data, Code>,
  headers?: Headers,
): Response {
  if (result.ok) {
    return Response.json(
      { ok: true, data: result.data },
      { status: result.status, headers },
    );
  }

  return Response.json(
    { ok: false, error: result.error },
    { status: result.status, headers },
  );
}
