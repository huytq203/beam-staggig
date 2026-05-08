"server-only";

import  jwtDecode  from "jwt-decode";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

interface KeycloakToken {
  exp: number;
  sub: string;
  preferred_username?: string;
  realm_access?: { roles: string[] };
  resource_access?: Record<string, { roles: string[] }>;
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return req.cookies?.ACCESS_TOKEN ?? null;
}

export function decodeToken(token: string): KeycloakToken | null {
  try {
    return jwtDecode<KeycloakToken>(token);
  } catch {     
    return null;
  }
}

export function isTokenExpired(decoded: KeycloakToken): boolean {
  return decoded.exp * 1000 < Date.now();
}

export function getUserRoles(decoded: KeycloakToken): string[] {
  return decoded.realm_access?.roles ?? [];
}

export function withAuth(handler: NextApiHandler, allowedRoles?: string[]): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "Chưa đăng nhập" });
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Token không hợp lệ" });
    }

    if (isTokenExpired(decoded)) {
      return res.status(401).json({ success: false, message: "Phiên đăng nhập hết hạn" });
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const userRoles = getUserRoles(decoded);
      const hasRole = allowedRoles.some((r) => userRoles.includes(r));
      if (!hasRole) {
        return res.status(403).json({ success: false, message: "Không có quyền truy cập" });
      }
    }

    return handler(req, res);
  };
}
