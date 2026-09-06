import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/lib/prisma/prisma";

type HealthResponse =
  | { status: "ok"; database: "up"; latencyMs: number }
  | { status: "error"; database: "down" }
  | { status: "error"; message: "unauthorized" | "health check is not configured" };

function tokensMatch(actual: string | undefined, expected: string): boolean {
  if (!actual) return false;

  const encoder = new TextEncoder();
  const actualBytes = encoder.encode(actual);
  const expectedBytes = encoder.encode(expected);
  return (
    actualBytes.length === expectedBytes.length &&
    crypto.timingSafeEqual(actualBytes, expectedBytes)
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const expectedToken = process.env.HEALTH_CHECK_TOKEN;
  if (!expectedToken) {
    console.error("[HEALTH CHECK] HEALTH_CHECK_TOKEN is not configured");
    return res.status(503).json({
      status: "error",
      message: "health check is not configured",
    });
  }

  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;

  if (!tokensMatch(token, expectedToken)) {
    return res.status(401).json({ status: "error", message: "unauthorized" });
  }

  const startedAt = Date.now();
  try {
    // This query deliberately reaches TiDB so scheduled calls keep it warm.
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: "ok",
      database: "up",
      latencyMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("[HEALTH CHECK] TiDB query failed", error);
    return res.status(503).json({ status: "error", database: "down" });
  }
}
