// Cho phép hạ timeout qua env khi QA/dev, vì ngồi chờ đủ 15 phút để test là bất khả thi.
// Không đặt env thì dùng giá trị thật theo yêu cầu nghiệp vụ.
const readEnvMs = (raw: string | undefined, fallback: number): number => {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/** Không thao tác quá mốc này thì đăng xuất. */
export const IDLE_TIMEOUT_MS = readEnvMs(
  process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MS,
  16 * 60 * 1000
);

// Scroll bắn hàng trăm event mỗi giây; ghi localStorage mỗi event sẽ giật UI.
export const ACTIVITY_THROTTLE_MS = 1 * 1000;

// Kiểm tra ngắn hơn 1 giây để logout sát mốc idle hơn mà không tạo timer dài.
export const SESSION_CHECK_INTERVAL_MS = 500;

// Mạng chậm không được phép giữ user ở lại trong phiên đáng ra đã chết.
export const LOGOUT_API_TIMEOUT_MS = 3 * 1000;

/** Mốc hoạt động cuối (epoch ms). Đặt ở localStorage để mọi tab dùng chung. */
export const LAST_ACTIVITY_KEY = 'LAST_ACTIVITY_AT';

/** Cờ báo các tab khác biết phiên đã kết thúc và vì lý do gì. */
export const SESSION_ENDED_KEY = 'SESSION_ENDED_REASON';

// mousemove CỐ TÌNH bị loại: chuột rê vô ý hoặc cảm biến rung sẽ gia hạn phiên
// vĩnh viễn, phá đúng mục đích bảo mật của idle timeout.
// keydown BẮT BUỘC có: user gõ form 15 phút mà không click sẽ bị đá ra oan.
export const ACTIVITY_EVENTS = [
  'click',
  'scroll',
  'keydown',
  'mousedown',
  'touchstart',
  'wheel',
] as const;
