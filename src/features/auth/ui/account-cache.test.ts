import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import { clearPrivateClientState } from "./account-cache";

describe("clearPrivateClientState", () => {
  it("removes account data and pending mutations while keeping the session query key", () => {
    const client = new QueryClient();
    client.setQueryData(["session"], { id: "account-1" });
    client.setQueryData(["progress", "account-1"], { minutes: 10 });
    client.getMutationCache().build(client, {
      mutationKey: ["save-progress"],
      mutationFn: async () => "ok",
    });

    clearPrivateClientState(client);

    expect(client.getQueryData(["progress", "account-1"])).toBeUndefined();
    expect(client.getQueryData(["session"])).toEqual({ id: "account-1" });
    expect(client.getMutationCache().getAll()).toEqual([]);
  });
});
