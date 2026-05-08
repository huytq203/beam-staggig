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

export function setCorsHeaders(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin ?? "";
  const allowedOrigins = getAllowedOrigins();

  const isAllowed = allowedOrigins.includes(origin);
  res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin : allowedOrigins[0]);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");
}

export function withCors(handler: NextApiHandler, strictOrigin = false): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const origin = req.headers.origin ?? "";
    const allowedOrigins = getAllowedOrigins();

    // Nếu có Origin header (browser cross-origin request) và không nằm trong whitelist → block
    if (strictOrigin && origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ success: false, message: "Origin không được phép" });
    }

    setCorsHeaders(req, res);

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    return handler(req, res);
  };
}
