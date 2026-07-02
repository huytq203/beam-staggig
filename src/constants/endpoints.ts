// Khi NEXT_PUBLIC_USE_PROXY=true: gọi API qua đường dẫn tương đối (cùng origin)
// và next.config.js sẽ rewrite sang backend thật -> tránh CORS khi dev local.
// Khi false (hoặc không set): gọi thẳng URL backend như bình thường.
const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY === 'true';

export const NEXT_PUBLIC_BEAM_API: any = USE_PROXY
  ? '/proxy-beam'
  : process.env.NEXT_PUBLIC_BEAM_API;
export const NEXT_PUBLIC_API_CORE: any = USE_PROXY
  ? '/proxy-core'
  : process.env.NEXT_PUBLIC_API_CORE;
export const NEXT_PUBLIC_API_CORE2: any = USE_PROXY
  ? '/proxy-core2'
  : process.env.NEXT_PUBLIC_API_CORE2;
export const NEXT_PUBLIC_API_PAYMENT: any = USE_PROXY
  ? '/proxy-payment'
  : process.env.NEXT_PUBLIC_API_PAYMENT;
export const NEXT_PUBLIC_BASE: any = process.env.NEXT_PUBLIC_BASE;
export const NEXT_PUBLIC_API_NOTIFICATION: any = USE_PROXY
  ? '/proxy-notification'
  : process.env.NEXT_PUBLIC_API_NOTIFICATION;
export const NEXT_PUBLIC_API_MAINTENANCE: any =
  process.env.NEXT_PUBLIC_API_MAINTENANCE;
