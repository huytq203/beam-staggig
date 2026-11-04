/*
 * Service worker nhận web push (FCM) cho chuông thông báo CMS.
 *
 * Không nạp Firebase SDK ở đây: FCM gửi web push chuẩn, nên chỉ cần đọc payload
 * { notification: { title, body }, data: { id, body } } từ sự kiện push.
 * - Có tab CMS đang hiển thị: chỉ báo cho tab (postMessage) để tab tải lại inbox và tự hiện toast.
 * - Không có tab nào hiển thị: hiện thông báo của hệ điều hành; bấm vào thì mở/focus CMS.
 * Đăng ký ở scope riêng (/firebase-cloud-messaging-push-scope) nên không điều khiển trang nào.
 */
const PUSH_MESSAGE_SOURCE = 'beam-notification-push';
const OPEN_MESSAGE_SOURCE = 'beam-notification-open';
const ICON = '/favicon.ico';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const sameOriginWindows = async () => {
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  return windows.filter((client) => {
    try {
      return new URL(client.url).origin === self.location.origin;
    } catch (_) {
      return false;
    }
  });
};

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (_) {
    payload = {};
  }
  const notification = payload.notification || {};
  const data = payload.data || {};
  const id = typeof data.id === 'string' ? data.id : null;

  event.waitUntil(
    (async () => {
      const windows = await sameOriginWindows();
      windows.forEach((client) => client.postMessage({ source: PUSH_MESSAGE_SOURCE, id }));
      if (windows.some((client) => client.visibilityState === 'visible')) return;
      await self.registration.showNotification(notification.title || 'Thông báo mới', {
        body: notification.body || '',
        icon: ICON,
        tag: id || undefined,
        data: { id },
      });
    })()
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const id = (event.notification.data && event.notification.data.id) || null;
  event.waitUntil(
    (async () => {
      const windows = await sameOriginWindows();
      if (windows.length > 0) {
        const target = windows.find((client) => client.focused) || windows[0];
        target.postMessage({ source: OPEN_MESSAGE_SOURCE, id });
        return target.focus();
      }
      return self.clients.openWindow('/');
    })()
  );
});
