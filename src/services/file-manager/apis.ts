import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints'

/**
 * Định tuyến File Manager theo loại tệp:
 * - news  -> route mới (Next.js API `/api/news/*` + Cloudflare R2), quản lý riêng cho tin tức.
 * - còn lại (logo, accounting, reporting, scheduler-notification, ...) -> BE cũ `${NEXT_PUBLIC_API_CORE}/file-manager/*`.
 *
 * Loại tệp được mã hoá ngay trong `path` (vd: "get-all", "accounting/get-all", "news/upload").
 */
export const isNewsFilePath = (path?: string) =>
  String(path ?? '')
    .replace(/^\/+/, '')
    .startsWith('news')

export const resolveFileManagerUrl = (path?: string) => {
  const clean = String(path ?? '').replace(/^\/+/, '')
  return isNewsFilePath(clean)
    ? `/api/${clean}`
    : `${NEXT_PUBLIC_API_CORE}/file-manager/${clean}`
}
