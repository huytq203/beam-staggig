"server-only";

import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { TooManyRequestsError } from "./errors";

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

function getClientKey(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]) ??
    req.socket.remoteAddress ??
    "unknown";
  return ip.trim();
}

export interface RateLimitOptions {
  capacity: number;
  refillPerSecond: number;
  scope?: string;
}

export function rateLimit(opts: RateLimitOptions) {
  const { capacity, refillPerSecond, scope = "default" } = opts;

  return function check(req: NextApiRequest): void {
    const key = `${scope}:${getClientKey(req)}`;
    const now = Date.now();
    const bucket = buckets.get(key) ?? { tokens: capacity, lastRefill: now };

    const elapsedSec = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(capacity, bucket.tokens + elapsedSec * refillPerSecond);
    bucket.lastRefill = now;

    if (bucket.tokens < 1) {
      buckets.set(key, bucket);
      throw new TooManyRequestsError();
    }

    bucket.tokens -= 1;
    buckets.set(key, bucket);
  };
}

export function withRateLimit(
  opts: RateLimitOptions,
  handler: NextApiHandler
): NextApiHandler {
  const check = rateLimit(opts);
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      check(req);
    } catch (err) {
      if (err instanceof TooManyRequestsError) {
        return res.status(429).json({ success: false, code: err.code, message: err.message });
      }
      throw err;
    }
    return handler(req, res);
  };
}

// Cleanup stale buckets every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      if (now - bucket.lastRefill > 10 * 60 * 1000) buckets.delete(key);
    }
  }, 10 * 60 * 1000).unref?.();
}
