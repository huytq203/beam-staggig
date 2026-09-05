import {
  ACTIVITY_EVENTS,
  ACTIVITY_THROTTLE_MS,
  IDLE_TIMEOUT_MS,
  SESSION_CHECK_INTERVAL_MS,
  SESSION_ENDED_KEY,
} from '@constants/session.constants';
import {
  readLastActivity,
  touchLastActivity,
} from '@services/auth/session.activity';
import { forceSignOut } from '@services/auth/session.cleanup';
import { getTokenExpMs } from '@services/auth/token.helper';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef } from 'react';

// Gate bằng cookie `user` thay vì import byPassUrl từ @contexts/authentication:
// contexts đã import ngược lại hook này, thêm import kia sẽ tạo vòng.
const isAuthenticated = (): boolean => Boolean(Cookies.get('user'));

export const useIdleLogout = (): void => {
  const lastWriteRef = useRef(0);
  // Chặn gọi forceSignOut nhiều lần khi các tick chạy chồng lúc đang redirect.
  const signingOutRef = useRef(false);

  const registerActivity = useCallback(() => {
    const nowMs = Date.now();
    if (nowMs - lastWriteRef.current < ACTIVITY_THROTTLE_MS) {
      return;
    }
    lastWriteRef.current = nowMs;
    touchLastActivity();
  }, []);

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

    const onActivity = () => registerActivity();

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, onActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, onActivity);
      });
    };
  }, [registerActivity]);

  // Vòng kiểm tra ngắn để logout ngay khi chạm mốc idle.
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
    }, SESSION_CHECK_INTERVAL_MS);

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
    };

    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);
};
