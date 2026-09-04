import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthAPIs } from './apis';

// Không đặt `expires` -> đây là session cookie, trình duyệt tự xoá khi đóng
// hẳn browser. Đây chính là cơ chế đáp ứng yêu cầu "đóng trình duyệt thì mất
// phiên"; đừng thêm `expires` lại vì tiện, sẽ phá yêu cầu đó.
//
// Mốc hết hạn thật của phiên không nằm ở cookie mà ở claim `exp` của refresh
// token, do useIdleLogout kiểm mỗi giây.
const getCookieOptions = (): Cookies.CookieAttributes => {
  const isSecure =
    typeof window !== 'undefined' && window.location.protocol === 'https:';
  return {
    secure: isSecure,
    sameSite: 'lax',
  };
};

export const saveAuthTokens = (accessToken: string, refreshToken?: string) => {
  const options = getCookieOptions();
  if (accessToken) {
    Cookies.set('ACCESS_TOKEN', accessToken, options);
  }
  if (refreshToken) {
    Cookies.set('REFRESH_TOKEN', refreshToken, options);
  }
};

// Chỉ cho 1 request refresh chạy tại một thời điểm; các request 401 song song
// cùng chờ chung một promise -> tránh gọi refresh nhiều lần (quan trọng nếu
// Keycloak bật refresh-token rotation, vì mỗi lần refresh sẽ huỷ token cũ).
let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    const refreshToken = Cookies.get('REFRESH_TOKEN');
    if (!refreshToken) {
      return Promise.reject(new Error('NO_REFRESH_TOKEN'));
    }
    // axios trần (không qua axiosInstance) để không lặp interceptor.
    refreshPromise = axios
      .post(AuthAPIs.REFRESH_TOKEN, { refresh_token: refreshToken })
      .then((res) => {
        const data = res?.data?.data;
        if (!data?.access_token) {
          throw new Error('REFRESH_FAILED');
        }
        saveAuthTokens(data.access_token, data.refresh_token);
        return data.access_token as string;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};
