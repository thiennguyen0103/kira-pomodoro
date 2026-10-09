import type { QueryClient } from "@tanstack/react-query";

import { sessionQueryKey } from "./session-client";

export function clearPrivateClientState(queryClient: QueryClient) {
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] !== sessionQueryKey[0],
  });
  queryClient.getMutationCache().clear();
}
