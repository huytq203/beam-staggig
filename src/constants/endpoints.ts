// Shared notification cutover is isolated from all legacy EWA services.
export const USE_SHARED_NOTIFICATION =
  process.env.NEXT_PUBLIC_SHARED_NOTIFICATION_ENABLED === "true";

// Next.js chỉ inline process.env.NEXT_PUBLIC_* khi dùng literal — không dùng bracket động
const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY === "true";

export const NEXT_PUBLIC_BEAM_API: string = USE_PROXY
  ? (process.env.NEXT_PUBLIC_BEAM_API_PROXY ?? "")
  : (process.env.NEXT_PUBLIC_BEAM_API_DIRECT ?? "");

export const NEXT_PUBLIC_API_CORE: string = USE_PROXY
  ? (process.env.NEXT_PUBLIC_API_CORE_PROXY ?? "")
  : (process.env.NEXT_PUBLIC_API_CORE_DIRECT ?? "");

export const NEXT_PUBLIC_API_CORE2: string = USE_PROXY
  ? (process.env.NEXT_PUBLIC_API_CORE2_PROXY ?? "")
  : (process.env.NEXT_PUBLIC_API_CORE2_DIRECT ?? "");

export const NEXT_PUBLIC_API_PAYMENT: string = USE_PROXY
  ? (process.env.NEXT_PUBLIC_API_PAYMENT_PROXY ?? "")
  : (process.env.NEXT_PUBLIC_API_PAYMENT_DIRECT ?? "");

export const NEXT_PUBLIC_API_NOTIFICATION: string = USE_PROXY
  ? (process.env.NEXT_PUBLIC_API_NOTIFICATION_PROXY ?? "/api/proxy/notification")
  : (USE_SHARED_NOTIFICATION
      ? (process.env.NEXT_PUBLIC_SHARED_NOTIFICATION_API_URL ?? "")
      : (process.env.NEXT_PUBLIC_API_NOTIFICATION_DIRECT ?? ""));

export const NEXT_PUBLIC_BASE: string            = process.env.NEXT_PUBLIC_BASE ?? "";
export const NEXT_PUBLIC_API_MAINTENANCE: string = process.env.NEXT_PUBLIC_API_MAINTENANCE ?? "";
