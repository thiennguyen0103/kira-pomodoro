"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { clearPrivateClientState } from "./account-cache";
import {
  publishAccountNotice,
  subscribeAccountNotices,
} from "./account-channel";
import { readAccount, sessionQueryKey } from "./session-client";

export function AccountSync() {
  const queryClient = useQueryClient();
  const session = useQuery({
    queryKey: sessionQueryKey,
    queryFn: readAccount,
  });
  const previousAccountId = useRef<string | null | undefined>(undefined);
  const ignoreNextChange = useRef(false);

  useEffect(() => {
    return subscribeAccountNotices((notice) => {
      ignoreNextChange.current = true;
      clearPrivateClientState(queryClient);

      if (notice.type === "signed-out") {
        queryClient.setQueryData(sessionQueryKey, null);
        return;
      }

      void queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    });
  }, [queryClient]);

  useEffect(() => {
    if (!session.isSuccess) {
      return;
    }

    const nextAccountId = session.data?.id ?? null;

    if (previousAccountId.current === undefined) {
      previousAccountId.current = nextAccountId;
      return;
    }

    if (previousAccountId.current === nextAccountId) {
      ignoreNextChange.current = false;
      return;
    }

    const fromAnotherTab = ignoreNextChange.current;
    ignoreNextChange.current = false;
    previousAccountId.current = nextAccountId;
    clearPrivateClientState(queryClient);

    if (fromAnotherTab) {
      return;
    }

    if (nextAccountId === null) {
      publishAccountNotice({ type: "signed-out" });
      return;
    }

    publishAccountNotice({
      type: "account-changed",
      accountId: nextAccountId,
    });
  }, [queryClient, session.data, session.isSuccess]);

  return null;
}
