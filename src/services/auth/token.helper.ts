import jwt_decode from 'jwt-decode';

interface JwtExpPayload {
  exp?: number;
}

/**
 * Trả về mốc hết hạn của JWT theo epoch milisecond, hoặc null nếu token rỗng /
 * hỏng / không có claim `exp`.
 *
 * Đọc động từ token thay vì hardcode số ngày, vì lifespan phía Keycloak bị đổi
 * giữa các lần deploy — mọi con số cứng trong FE sẽ sai.
 */
export const getTokenExpMs = (token?: string | null): number | null => {
  if (!token) {
    return null;
  }
  try {
    const payload = jwt_decode<JwtExpPayload>(token);
    if (typeof payload?.exp !== 'number') {
      return null;
    }
    // Claim `exp` của JWT tính bằng giây, Date.now() tính bằng milisecond.
    return payload.exp * 1000;
  } catch {
    return null;
  }
};
