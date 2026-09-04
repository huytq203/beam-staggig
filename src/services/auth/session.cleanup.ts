import {
  LOGOUT_API_TIMEOUT_MS,
  SESSION_ENDED_KEY,
} from '@constants/session.constants';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthAPIs } from './apis';
import { clearLastActivity } from './session.activity';

export type SignOutReason = 'idle' | 'expired' | 'manual';

/**
 * Nguồn sự thật duy nhất cho việc xoá phiên phía client.
 *
 * Trước đây logic này bị chép ở 3 nơi và không đồng nhất (một chỗ quên xoá
 * cookie `user`, để lại trạng thái nửa đăng nhập).
 */
export const clearSession = (): void => {
  Cookies.remove('ACCESS_TOKEN');
  Cookies.remove('REFRESH_TOKEN');
  Cookies.remove('user');
  clearLastActivity();
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem('isLogout', 'true');
  } catch {
    // bỏ qua
  }
};

/**
 * Kết thúc phiên: báo các tab khác, revoke phía BE, dọn client, về trang đăng nhập.
 */
export const forceSignOut = async (reason: SignOutReason): Promise<void> => {
  if (typeof window === 'undefined') {
    clearSession();
    return;
  }

  // Báo các tab khác TRƯỚC khi xoá cookie, để chúng đi theo mà không tự gọi
  // lại API logout lần nữa.
  try {
    window.localStorage.setItem(SESSION_ENDED_KEY, reason);
  } catch {
    // bỏ qua
  }

  // reason 'expired' nghĩa là refresh token đã chết -> gọi revoke chỉ tổ ăn 401
  // vô ích. Bỏ qua luôn.
  const accessToken = Cookies.get('ACCESS_TOKEN');
  if (reason !== 'expired' && accessToken) {
    try {
      await Promise.race([
        // axios trần chứ KHÔNG qua axiosInstance, vì hai lý do:
        //   1. axiosInstance import clearSession từ chính file này -> vòng import;
        //   2. response interceptor của nó tự redirect khi gặp 401, cướp mất
        //      redirect kèm tham số `reason` ở cuối hàm.
        axios.post(
          AuthAPIs.LOGOUT_ACCESS_TOKEN,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } }
        ),
        new Promise<void>((resolve) => {
          window.setTimeout(resolve, LOGOUT_API_TIMEOUT_MS);
        }),
      ]);
    } catch {
      // Revoke là best-effort: BE lỗi hay mạng chậm không được chặn đăng xuất.
    }
  }

  clearSession();

  const redirectUrl = encodeURIComponent(
    window.location.pathname + window.location.search
  );
  window.location.href = `/auth/signin?reason=${reason}&redirectUrl=${redirectUrl}`;
};
