import {
  ACTIVITY_EVENTS,
  ACTIVITY_THROTTLE_MS,
  IDLE_TIMEOUT_MS,
  IDLE_WARNING_MS,
  LAST_ACTIVITY_KEY,
  SESSION_ENDED_KEY,
} from '@constants/session.constants';
import {
  readLastActivity,
  touchLastActivity,
} from '@services/auth/session.activity';
import { forceSignOut } from '@services/auth/session.cleanup';
import { getTokenExpMs } from '@services/auth/token.helper';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef, useState } from 'react';

// Gate bằng cookie `user` thay vì import byPassUrl từ @contexts/authentication:
// contexts đã import ngược lại hook này, thêm import kia sẽ tạo vòng.
const isAuthenticated = (): boolean => Boolean(Cookies.get('user'));

interface UseIdleLogoutResult {
  showWarning: boolean;
  remainingMs: number;
  extendSession: () => void;
}

export const useIdleLogout = (): UseIdleLogoutResult => {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingMs, setRemainingMs] = useState(IDLE_WARNING_MS);

  // Listener đọc showWarning qua ref: closure của addEventListener sẽ giữ giá
  // trị state cũ nếu đọc trực tiếp.
  const showWarningRef = useRef(false);
  const lastWriteRef = useRef(0);
  // Chặn gọi forceSignOut nhiều lần khi tick 1s chạy chồng lúc đang redirect.
  const signingOutRef = useRef(false);

  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  const registerActivity = useCallback((force = false) => {
    const nowMs = Date.now();
    if (!force && nowMs - lastWriteRef.current < ACTIVITY_THROTTLE_MS) {
      return;
    }
    lastWriteRef.current = nowMs;
    touchLastActivity();
  }, []);

  const extendSession = useCallback(() => {
    registerActivity(true);
    setShowWarning(false);
  }, [registerActivity]);

  // Lắng nghe tương tác của user.
  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    // Mốc rỗng nghĩa là chưa từng theo dõi (lần đầu vào app) -> khởi tạo từ bây
    // giờ. Mốc cũ mà quá hạn thì để tick bên dưới xử lý: đó chính là cách bịt
    // trường hợp Chrome khôi phục session cookie sau khi đóng browser.
    if (readLastActivity() === 0) {
      touchLastActivity();
    }

    const onActivity = () => {
      // Khi modal cảnh báo đang mở, tương tác thường KHÔNG được gia hạn phiên.
      // Nếu cho phép, chính cú click mở modal hoặc một cú scroll vô ý sẽ đóng
      // modal ngay lập tức và cảnh báo trở nên vô nghĩa. Chỉ nút "Tiếp tục làm
      // việc" mới gia hạn.
      if (showWarningRef.current) {
        return;
      }
      registerActivity();
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, onActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, onActivity);
      });
    };
  }, [registerActivity]);

  // Vòng kiểm tra mỗi giây.
  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    // So sánh timestamp thay vì setTimeout dài: timer dài bị browser throttle
    // khi tab ở nền và chạy sai hoàn toàn khi máy sleep.
    const intervalId = window.setInterval(() => {
      if (signingOutRef.current) {
        return;
      }

      // 1. Hết hạn tuyệt đối. Đọc lại cookie mỗi tick, KHÔNG cache: nếu Keycloak
      //    bật refresh token rotation thì mỗi lần refresh sẽ cấp token mới với
      //    exp mới, mốc này trượt về sau.
      //    Chỉ dùng refresh token. Access token sống 5 phút, ngắn hơn timeout
      //    idle 15 phút — lấy nhầm nó sẽ đá user ra oan.
      const refreshExpMs = getTokenExpMs(Cookies.get('REFRESH_TOKEN'));
      if (refreshExpMs === null || refreshExpMs <= Date.now()) {
        signingOutRef.current = true;
        void forceSignOut('expired');
        return;
      }

      const idleForMs = Date.now() - readLastActivity();

      // 2. Đủ 15 phút không thao tác.
      if (idleForMs >= IDLE_TIMEOUT_MS) {
        signingOutRef.current = true;
        void forceSignOut('idle');
        return;
      }

      // 3. Sắp hết giờ -> bật cảnh báo và đếm ngược.
      if (idleForMs >= IDLE_TIMEOUT_MS - IDLE_WARNING_MS) {
        setShowWarning(true);
        setRemainingMs(IDLE_TIMEOUT_MS - idleForMs);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // Đồng bộ giữa các tab.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === SESSION_ENDED_KEY && event.newValue) {
        // Tab khác đã kết thúc phiên và đã revoke rồi; tab này chỉ việc đi theo,
        // không gọi lại API logout lần nữa.
        signingOutRef.current = true;
        window.location.href = `/auth/signin?reason=${event.newValue}`;
        return;
      }

      if (event.key === LAST_ACTIVITY_KEY) {
        // Tab khác vừa có thao tác (hoặc vừa bấm "Tiếp tục làm việc") -> tab này
        // đóng cảnh báo theo, tránh cảnh báo ma ở tab đang nằm nền.
        const ts = Number(event.newValue);
        if (
          Number.isFinite(ts) &&
          Date.now() - ts < IDLE_TIMEOUT_MS - IDLE_WARNING_MS
        ) {
          setShowWarning(false);
        }
      }
    };

    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return { showWarning, remainingMs, extendSession };
};
