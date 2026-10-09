import "server-only";

import { db } from "@/lib/db";

export async function saveDisplayName(
  accountId: string,
  displayName: string,
): Promise<void> {
  await db.user.update({
    where: { id: accountId },
    data: { name: displayName },
  });
}
