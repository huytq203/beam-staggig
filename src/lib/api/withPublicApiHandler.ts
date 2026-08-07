"server-only";

import type { NextApiHandler } from "next";
import { withCors } from "./withCors";
import { withRateLimit, type RateLimitOptions } from "./rateLimit";

/**
 * Wrapper cho các endpoint đọc công khai (landing page gọi không kèm token).
 * Khác `withApiHandler` ở chỗ KHÔNG có `withAuth`, và nới CORS/rate-limit.
 *
 * Rate limit tính theo IP, mà toàn bộ traffic landing đi qua một IP server duy
 * nhất (Next.js ISR + proxy route đều fetch từ phía server), nên hạn mức mặc
 * định 60 req/phút của `withApiHandler` sẽ chặn nhầm. Đặt 300 req/phút.
 */
const PUBLIC_RATE_LIMIT: RateLimitOptions = {
  capacity: 300,
  refillPerSecond: 5,
  scope: "public",
};

export function withPublicApiHandler(
  handler: NextApiHandler,
  rateLimit: RateLimitOptions = PUBLIC_RATE_LIMIT
): NextApiHandler {
  // strictCors = false: request server-to-server không gửi `Origin`, và endpoint
  // này công khai nên không cần khoá theo whitelist origin.
  return withCors(withRateLimit(rateLimit, handler), false);
}

/** Envelope của BE cũ. Thứ tự khoá: message → data → code. */
export function publicOk<T>(data: T) {
  return { message: "OK", data, code: 200 };
}

export function publicError(message: string, code: number) {
  return { message, data: null, code };
}
