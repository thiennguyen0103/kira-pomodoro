import "server-only";

import "@/lib/env";
import prisma from "@/lib/prisma";

export const db = prisma;
