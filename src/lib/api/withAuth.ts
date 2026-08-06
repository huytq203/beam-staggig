"server-only";

import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
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

// Xác thực token bằng cách gọi identity `/external/jwt/verify` — đúng cách mà
// mọi service Java trong hệ thống vẫn làm.
//
// Trước đây chỗ này tự verify chữ ký bằng jose + JWKS lấy thẳng từ Keycloak
// (`KEYCLOAK_ISSUER` = https://<ip>:8443/realms/ewa). Cách đó chết khi chạy trên
// Amplify: cổng 8443 của Keycloak chỉ mở cho vài IP cố định, mà Amplify chạy
// trên Lambda nên đi ra bằng IP của AWS -> fetch JWKS treo -> timeout 5s -> mọi
// API tin tức trả 401 INVALID_TOKEN ("request timed out"). Identity thì đã có
// tên miền công khai nên gọi được từ Lambda.
const IDENTITY_BASE_URL =
  process.env.IDENTITY_VERIFY_URL ||
  process.env.NEXT_PUBLIC_BEAM_API_DIRECT ||
  process.env.NEXT_PUBLIC_BEAM_API;

const VERIFY_TIMEOUT_MS = 5_000;

interface IdentityTokenInformation {
  userId?: string;
  userName?: string;
  fullName?: string;
  email?: string;
  roles?: string[];
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return req.cookies?.ACCESS_TOKEN ?? null;
}

export async function verifyToken(token: string): Promise<KeycloakToken> {
  if (!IDENTITY_BASE_URL) {
    throw new Error("NEXT_PUBLIC_BEAM_API_DIRECT chưa được cấu hình");
  }

  const url = `${IDENTITY_BASE_URL.replace(/\/+$/, "")}/external/jwt/verify`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new Error(`Không gọi được identity để xác thực token: ${reason}`);
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 401 || response.status === 403) {
    throw new UnauthorizedError("Token không hợp lệ hoặc đã hết hạn");
  }
  if (!response.ok) {
    throw new Error(`identity /external/jwt/verify trả về ${response.status}`);
  }

  const body = (await response.json()) as { data?: IdentityTokenInformation };
  const info = body?.data;
  if (!info?.userId) {
    throw new UnauthorizedError("Token không hợp lệ (thiếu userId)");
  }

  return {
    sub: info.userId,
    preferred_username: info.userName,
    email: info.email,
    name: info.fullName,
    realm_access: { roles: Array.isArray(info.roles) ? info.roles : [] },
  };
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
