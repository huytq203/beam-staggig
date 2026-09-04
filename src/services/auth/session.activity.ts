import {
  LAST_ACTIVITY_KEY,
  SESSION_ENDED_KEY,
} from '@constants/session.constants';

// localStorage ném lỗi ở chế độ ẩn danh và một số policy bảo mật doanh nghiệp;
// mất mốc hoạt động không được phép làm sập cả app.
const safeGet = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // bỏ qua
  }
};

const safeRemove = (key: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch {
    // bỏ qua
  }
};

/** Mốc hoạt động cuối theo epoch ms; trả 0 nếu chưa có hoặc giá trị hỏng. */
export const readLastActivity = (): number => {
  const parsed = Number(safeGet(LAST_ACTIVITY_KEY));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export const touchLastActivity = (): void => {
  safeSet(LAST_ACTIVITY_KEY, String(Date.now()));
};

export const clearLastActivity = (): void => {
  safeRemove(LAST_ACTIVITY_KEY);
};

/**
 * Gọi ngay khi đăng nhập thành công.
 *
 * Bắt buộc ghi đè mốc hoạt động: LAST_ACTIVITY_AT sống ở localStorage nên tồn
 * tại qua lần đóng browser. Không ghi đè thì giá trị cũ đã quá 15 phút sẽ đá
 * user ra ngay giây đầu tiên sau khi đăng nhập thành công.
 */
export const startSessionTracking = (): void => {
  safeRemove(SESSION_ENDED_KEY);
  touchLastActivity();
};
