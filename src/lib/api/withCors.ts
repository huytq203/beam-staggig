"server-only";

import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const DEFAULT_ALLOWED_ORIGINS = [
  // Dev không cố định cổng → cho phép mọi cổng của localhost.
  "http://localhost:*",
  "http://127.0.0.1:*",
  "https://admin.flexpay.vn",
  "https://www.beamewa.com.vn",
  "https://www.flexpay.com.vn",
];

function getAllowedOrigins(): string[] {
  const env = process.env.CORS_ALLOWED_ORIGINS;
  if (!env) return DEFAULT_ALLOWED_ORIGINS;
  return env.split(",").map((o) => o.trim()).filter(Boolean);
}

/**
 * Mỗi entry trong danh sách có thể là:
 *   "*"                        → mọi origin (chỉ nên dùng khi thật sự cần)
 *   "http://localhost:*"       → host đó với bất kỳ cổng nào, kể cả không cổng
 *   "https://admin.flexpay.vn" → khớp tuyệt đối
 *
 * Phần sau dấu ":" bắt buộc phải toàn chữ số, nếu không thì
 * "http://localhost:3000.evil.com" sẽ lọt qua.
 */
function matchesOrigin(origin: string, pattern: string): boolean {
  if (pattern === "*" || pattern === origin) return true;
  if (!pattern.endsWith(":*")) return false;

  const base = pattern.slice(0, -2); // "http://localhost"
  if (origin === base) return true;
  if (!origin.startsWith(`${base}:`)) return false;
  return /^\d+$/.test(origin.slice(base.length + 1));
}

function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  if (!origin) return false;
  return allowedOrigins.some((pattern) => matchesOrigin(origin, pattern));
}

export function setCorsHeaders(req: NextApiRequest, res: NextApiResponse): boolean {
  const origin = req.headers.origin ?? "";
  const allowedOrigins = getAllowedOrigins();
  const isAllowed = isOriginAllowed(origin, allowedOrigins);

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return isAllowed || origin === "";
}

export function withCors(handler: NextApiHandler, strictOrigin = true): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const origin = req.headers.origin ?? "";
    const allowedOrigins = getAllowedOrigins();

    if (strictOrigin && origin && !isOriginAllowed(origin, allowedOrigins)) {
      return res.status(403).json({ success: false, code: "FORBIDDEN_ORIGIN", message: "Origin không được phép" });
    }

    setCorsHeaders(req, res);

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    return handler(req, res);
  };
}
