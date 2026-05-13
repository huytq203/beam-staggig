"server-only";

import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://admin.flexpay.vn",
  "https://www.beamewa.com.vn",
];

function getAllowedOrigins(): string[] {
  const env = process.env.CORS_ALLOWED_ORIGINS;
  if (!env) return DEFAULT_ALLOWED_ORIGINS;
  return env.split(",").map((o) => o.trim()).filter(Boolean);
}

function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  if (!origin) return false;
  if (allowedOrigins.includes("*")) return true;
  return allowedOrigins.includes(origin);
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
