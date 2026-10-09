export const accountChannelName = "kira-account";

export type AccountNotice =
  | { type: "signed-out" }
  | { type: "account-changed"; accountId: string };

function isAccountNotice(value: unknown): value is AccountNotice {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return false;
  }

  if (value.type === "signed-out") {
    return true;
  }

  return (
    value.type === "account-changed" &&
    "accountId" in value &&
    typeof value.accountId === "string" &&
    value.accountId.length > 0
  );
}

export function publishAccountNotice(notice: AccountNotice) {
  if (typeof BroadcastChannel === "undefined") {
    return;
  }

  const channel = new BroadcastChannel(accountChannelName);
  channel.postMessage(notice);
  channel.close();
}

export function subscribeAccountNotices(
  onNotice: (notice: AccountNotice) => void,
) {
  if (typeof BroadcastChannel === "undefined") {
    return () => undefined;
  }

  const channel = new BroadcastChannel(accountChannelName);
  const handle = (event: MessageEvent) => {
    if (isAccountNotice(event.data)) {
      onNotice(event.data);
    }
  };

  channel.addEventListener("message", handle);

  return () => {
    channel.removeEventListener("message", handle);
    channel.close();
  };
}
