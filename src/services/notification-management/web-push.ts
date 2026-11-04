import axios from 'axios';
import Cookies from 'js-cookie';
import { NotificationManagementAPIs } from './apis';

/**
 * Web push (FCM) cho chuông thông báo CMS.
 *
 * Trình duyệt lấy token FCM rồi đăng ký với service thông báo chung
 * (`/notification/register-token`, platform "web"). Khi BE ghi một thông báo vào inbox
 * của admin/HR, worker gửi push tới token này; service worker
 * (`public/firebase-messaging-sw.js`) báo cho tab đang mở để tải lại inbox ngay,
 * hoặc hiện thông báo hệ điều hành nếu không có tab nào hiển thị.
 *
 * Mọi lời gọi ở đây là best-effort: thiếu cấu hình, trình duyệt không hỗ trợ, người dùng
 * từ chối quyền hay BE lỗi thì chỉ bỏ qua, chuông vẫn chạy bằng polling như cũ.
 * Dùng axios trần (không qua axiosInstance) để lỗi nền không bật toast hay đá về trang đăng nhập.
 */

// Next.js chỉ inline process.env.NEXT_PUBLIC_* khi viết dạng literal.
const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? '';

export const WEB_PUSH_MESSAGE_SOURCE = 'beam-notification-push';
export const WEB_PUSH_OPEN_SOURCE = 'beam-notification-open';

const SERVICE_WORKER_URL = '/firebase-messaging-sw.js';
// Scope riêng như Firebase mặc định: service worker không điều khiển trang nào của CMS.
const SERVICE_WORKER_SCOPE = '/firebase-cloud-messaging-push-scope';
const FIREBASE_APP_NAME = 'beam-cms-web-push';
const APP_ID = 'ewa-cms';
const INSTALLATION_KEY = 'beamWebPushInstallationId';
const TOKEN_KEY = 'beamWebPushToken';
const UNREGISTER_TIMEOUT_MS = 1500;

const readStorage = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
const writeStorage = (key: string, value: string | null) => {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // bỏ qua: không lưu được thì lần sau đăng ký lại
  }
};

const installationId = (): string => {
  let id = readStorage(INSTALLATION_KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    writeStorage(INSTALLATION_KEY, id);
  }
  return `web:${id}`;
};

export const isWebPushConfigured = (): boolean =>
  Boolean(
    FIREBASE_CONFIG.apiKey &&
      FIREBASE_CONFIG.projectId &&
      FIREBASE_CONFIG.messagingSenderId &&
      FIREBASE_CONFIG.appId &&
      VAPID_KEY
  );

export const isWebPushAvailable = (): boolean =>
  typeof window !== 'undefined' &&
  isWebPushConfigured() &&
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window;

const messaging = async () => {
  const [{ getApps, initializeApp }, firebaseMessaging] = await Promise.all([
    import('firebase/app'),
    import('firebase/messaging'),
  ]);
  if (!(await firebaseMessaging.isSupported())) return null;
  const app =
    getApps().find((x) => x.name === FIREBASE_APP_NAME) ??
    initializeApp(FIREBASE_CONFIG, FIREBASE_APP_NAME);
  return { api: firebaseMessaging, instance: firebaseMessaging.getMessaging(app) };
};

/** Quyền thông báo của trình duyệt; "unsupported" khi không dùng được web push. */
export const webPushPermission = (): NotificationPermission | 'unsupported' =>
  isWebPushAvailable() ? window.Notification.permission : 'unsupported';

const authHeaders = (accessToken?: string | null): Record<string, string> => {
  const token = accessToken ?? Cookies.get('ACCESS_TOKEN');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Đăng ký trình duyệt này nhận web push cho tài khoản đang đăng nhập.
 * Chỉ chạy khi quyền thông báo đã là "granted"; xin quyền là việc của {@link requestWebPushPermission}.
 */
export const registerWebPush = async (): Promise<boolean> => {
  if (!isWebPushAvailable() || Notification.permission !== 'granted') return false;
  try {
    const fcm = await messaging();
    if (!fcm) return false;
    const registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL, {
      scope: SERVICE_WORKER_SCOPE,
    });
    const token = await fcm.api.getToken(fcm.instance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) return false;
    await axios.post(
      `${NotificationManagementAPIs.BASE}/register-token`,
      { token, installationId: installationId(), platform: 'web', appId: APP_ID },
      { headers: authHeaders() }
    );
    writeStorage(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.warn('[web-push] Không đăng ký được web push', error);
    return false;
  }
};

/**
 * Xin quyền thông báo. Firefox/Safari chỉ cho xin trong một thao tác của người dùng,
 * nên hàm này được gọi từ sự kiện click đầu tiên trên trang.
 */
export const requestWebPushPermission = async (): Promise<boolean> => {
  if (!isWebPushAvailable() || Notification.permission === 'denied') return false;
  try {
    const permission =
      Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission();
    return permission === 'granted';
  } catch {
    return false;
  }
};

/**
 * Gỡ token của trình duyệt này khỏi tài khoản đang đăng xuất, để người dùng đăng nhập sau
 * trên cùng máy không nhận thông báo của tài khoản cũ. Có giới hạn thời gian để không chặn đăng xuất.
 */
export const unregisterWebPush = async (accessToken?: string | null): Promise<void> => {
  if (typeof window === 'undefined') return;
  const token = readStorage(TOKEN_KEY);
  if (!token) return;
  writeStorage(TOKEN_KEY, null);
  const work = (async () => {
    try {
      await axios.post(
        `${NotificationManagementAPIs.BASE}/unregister-token`,
        { token, installationId: installationId() },
        { headers: authHeaders(accessToken) }
      );
    } catch {
      // best-effort
    }
    try {
      const fcm = isWebPushAvailable() ? await messaging() : null;
      if (fcm) await fcm.api.deleteToken(fcm.instance);
    } catch {
      // best-effort
    }
  })();
  await Promise.race([
    work,
    new Promise<void>((resolve) => window.setTimeout(resolve, UNREGISTER_TIMEOUT_MS)),
  ]);
};
