"server-only";

import type { NextApiHandler } from "next";
import { withAuth } from "./withAuth";
import { withCors } from "./withCors";
import { withRateLimit, type RateLimitOptions } from "./rateLimit";

const DEFAULT_RATE_LIMIT: RateLimitOptions = {
  capacity: 60,
  refillPerSecond: 1, // ~60 req/phút, burst 60
  scope: "default",
};

export interface ApiHandlerOptions {
  rateLimit?: RateLimitOptions | false;
  strictCors?: boolean;
}

export function withApiHandler(
  handler: NextApiHandler,
  allowedRoles?: string[],
  options: ApiHandlerOptions = {},
): NextApiHandler {
  const { rateLimit = DEFAULT_RATE_LIMIT, strictCors = true } = options;

  let wrapped = withAuth(handler, allowedRoles);
  if (rateLimit !== false) {
    wrapped = withRateLimit(rateLimit, wrapped);
  }
  return withCors(wrapped, strictCors);
}
