"server-only";

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ForbiddenError, UnauthorizedError } from "./errors";

export interface KeycloakToken extends JWTPayload {
  sub: string;
  preferred_username?: string;
  email?: string;
  realm_access?: { roles: string[] };
  resource_access?: Record<string, { roles: string[] }>;
}

const KEYCLOAK_ISSUER = process.env.KEYCLOAK_ISSUER;
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!KEYCLOAK_ISSUER) {
    throw new Error("KEYCLOAK_ISSUER chưa được cấu hình");
  }
  if (!jwksCache) {
    jwksCache = createRemoteJWKSet(
      new URL(`${KEYCLOAK_ISSUER}/protocol/openid-connect/certs`),
      {
        cooldownDuration: 30_000,
        cacheMaxAge: 10 * 60_000,
        timeoutDuration: 5_000,
      }
    );
  }
  return jwksCache;
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return req.cookies?.ACCESS_TOKEN ?? null;
}

export async function verifyToken(token: string): Promise<KeycloakToken> {
  // DEBUG: log raw JWKS to verify what jose actually fetched
  try {
    const jwksUrl = `${KEYCLOAK_ISSUER}/protocol/openid-connect/certs`;
    const res = await fetch(jwksUrl);
    const json: any = await res.json();
    console.log("[withAuth DEBUG] JWKS fetched:", JSON.stringify(json.keys?.map((k: any) => ({ kid: k.kid, alg: k.alg, use: k.use })) ?? []));
    const header = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString("utf8"));
    console.log("[withAuth DEBUG] Token header:", JSON.stringify(header));
  } catch (e) {
    console.error("[withAuth DEBUG] cannot fetch JWKS:", e instanceof Error ? e.message : e);
  }

  const { payload } = await jwtVerify(token, getJWKS(), {
    issuer: KEYCLOAK_ISSUER,
  });
  if (!payload.sub) {
    throw new UnauthorizedError("Token không hợp lệ (thiếu sub)");
  }
  return payload as KeycloakToken;
}

export function getUserRoles(decoded: KeycloakToken): string[] {
  return decoded.realm_access?.roles ?? [];
}

declare module "next" {
  interface NextApiRequest {
    user?: KeycloakToken;
  }
}

export function withAuth(handler: NextApiHandler, allowedRoles?: string[]): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ success: false, code: "UNAUTHORIZED", message: "Chưa đăng nhập" });
    }

    let decoded: KeycloakToken;
    try {
      decoded = await verifyToken(token);
    } catch (err) {
      console.error("[withAuth] verify failed:", err instanceof Error ? err.message : err);
      const msg = err instanceof Error ? err.message : "Token không hợp lệ";
      return res.status(401).json({ success: false, code: "INVALID_TOKEN", message: msg });
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const userRoles = getUserRoles(decoded);
      const hasRole = allowedRoles.some((r) => userRoles.includes(r));
      if (!hasRole) {
        const err = new ForbiddenError();
        return res.status(err.status).json({ success: false, code: err.code, message: err.message });
      }
    }

    req.user = decoded;
    return handler(req, res);
  };
}
