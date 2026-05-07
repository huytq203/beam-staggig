"server-only";

import type { NextApiHandler } from "next";
import { withAuth } from "./withAuth";
import { withCors } from "./withCors";

export function withApiHandler(handler: NextApiHandler, allowedRoles?: string[]): NextApiHandler {
  return withCors(withAuth(handler, allowedRoles));
}
