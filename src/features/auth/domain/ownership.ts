export type OwnerDecision =
  | { allowed: true; accountId: string }
  | { allowed: false; code: "unauthenticated" | "forbidden" };

export function authorizeOwner(
  actorId: string | null | undefined,
  resourceOwnerId: string,
): OwnerDecision {
  if (!actorId) {
    return { allowed: false, code: "unauthenticated" };
  }

  if (actorId !== resourceOwnerId) {
    return { allowed: false, code: "forbidden" };
  }

  return { allowed: true, accountId: actorId };
}
