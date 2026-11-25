"server-only";

import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createRemoteJWKSet, errors as joseErrors, jwtVerify } from "jose";
import { ForbiddenError, UnauthorizedError } from "./errors";

export interface KeycloakToken {
  sub: string;
  preferred_username?: string;
  email?: string;
  name?: string;
  realm_access?: { roles: string[] };
  resource_access?: Record<string, { roles: string[] }>;
  [propName: string]: unknown;
}

// Verify JWT offline bằng JWKS của realm `ewa-hr` (Unified Identity + Keycloak 26),
// giống cách ewa-core / ewa-payment / ewa-reporting đang làm.
//
// `/external/jwt/verify` của beam.ewa.identity cũ đã tắt. JWKS được mở qua HTTPS
// công khai (cổng 443) nên không còn cảnh fetch treo vì cổng 8443 chỉ mở cho vài
// IP như thời Amplify. `createRemoteJWKSet` cache key trong bộ nhớ và chỉ fetch
// lại khi gặp `kid` lạ, nên mỗi request không tốn thêm một round-trip.
//
// Mặc định trỏ DEV; production phải đặt EWA_JWKS_URI + EWA_JWT_ISSUER.
const JWKS_URI =
  process.env.EWA_JWKS_URI ||
  "https://api.dev.ewallet.flexpay.vn/identity/api/v1/.well-known/jwks/ewa-hr";
const ALLOWED_ISSUER =
  process.env.EWA_JWT_ISSUER ||
  "https://keycloak.dev.ewallet.flexpay.vn/realms/ewa-hr";

const jwks = createRemoteJWKSet(new URL(JWKS_URI), {
  timeoutDuration: 5_000,
  cooldownDuration: 30_000,
});

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return req.cookies?.ACCESS_TOKEN ?? null;
}

// Payload Keycloak: sub -> userId, preferred_username -> userName,
// email/name -> hiển thị, realm_access.roles -> kiểm `allowedRoles`.
export async function verifyToken(token: string): Promise<KeycloakToken> {
  let payload: Record<string, unknown>;
  try {
    ({ payload } = await jwtVerify(token, jwks, {
      issuer: ALLOWED_ISSUER,
      algorithms: ["RS256"],
    }));
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) {
      throw new UnauthorizedError("Token đã hết hạn");
    }
    // Lỗi mạng / timeout khi lấy JWKS không phải lỗi của token -> giữ nguyên
    // nguyên nhân để log; các lỗi JOSE còn lại (chữ ký, issuer, định dạng,
    // không khớp kid) đều là token không hợp lệ.
    if (err instanceof joseErrors.JWKSTimeout || !(err instanceof joseErrors.JOSEError)) {
      const reason = err instanceof Error ? err.message : String(err);
      throw new Error(`Không lấy được JWKS để xác thực token: ${reason}`);
    }
    throw new UnauthorizedError("Token không hợp lệ");
  }

  if (typeof payload.sub !== "string" || !payload.sub) {
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
