"server-only";

import { news_articles, Prisma } from "@prisma/client";

export interface NewsResponse {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  description: string | null;
  content?: string | null;
  ref: string | null;
  isHotNew: boolean;
  tags: string[] | null;
  shows: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

function parseTags(value: Prisma.JsonValue | null | undefined): string[] | null {
  if (value == null) return null;
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : null;
    } catch {
      return null;
    }
  }
  return null;
}

export function toNewsResponse(data: news_articles): NewsResponse {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    coverImage: data.cover_image,
    description: data.description,
    content: data.content,
    ref: data.ref,
    isHotNew: data.is_hot_new ?? false,
    tags: parseTags(data.tags),
    shows: data.shows ?? true,
    status: data.status ?? "ACTIVE",
    createdAt: data.created_at?.toISOString() ?? "",
    updatedAt: data.updated_at?.toISOString() ?? "",
    createdBy: data.created_by,
    updatedBy: data.updated_by,
  };
}

export function toNewsEntity(data: {
  title?: string;
  slug?: string;
  coverImage?: string | null;
  description?: string | null;
  content?: string | null;
  ref?: string | null;
  isHotNew?: boolean;
  tags?: string[] | null;
  shows?: boolean;
  status?: string;
}): Prisma.news_articlesUpdateInput {
  const entity: Prisma.news_articlesUpdateInput = {};
  if (data.title !== undefined) entity.title = data.title;
  if (data.slug !== undefined) entity.slug = data.slug;
  if (data.coverImage !== undefined) entity.cover_image = data.coverImage;
  if (data.description !== undefined) entity.description = data.description;
  if (data.content !== undefined) entity.content = data.content;
  if (data.ref !== undefined) entity.ref = data.ref;
  if (data.isHotNew !== undefined) entity.is_hot_new = data.isHotNew;
  if (data.tags !== undefined) entity.tags = data.tags === null ? Prisma.JsonNull : data.tags;
  if (data.shows !== undefined) entity.shows = data.shows;
  if (data.status !== undefined) entity.status = data.status;
  return entity;
}

/* ------------------------------------------------------------------ *
 * Public mappers — bám contract của BE cũ (Spring) cho landing page.
 * Khác `toNewsResponse` ở hai điểm bắt buộc:
 *  1. Thứ tự & tập khoá phải trùng payload cũ (list không có `content`/`ref`).
 *  2. Timestamp trả về dạng naive, KHÔNG có hậu tố `Z`.
 * ------------------------------------------------------------------ */

/**
 * BE cũ trả `2025-07-24T08:12:22.573168` (LocalDateTime, không timezone).
 * `toISOString()` trả `...573Z` → `new Date()` phía landing hiểu là UTC và
 * cộng thêm 7 tiếng khi `toLocaleString("vi-VN")`. Bỏ `Z` để giữ nguyên cách
 * hiển thị cũ. Ba chữ số micro cuối là 0 vì JS Date chỉ có độ phân giải ms.
 */
function toNaiveDateTime(value: Date | null | undefined): string | null {
  // BE cũ trả `null` (không phải chuỗi rỗng) khi cột DATETIME là NULL.
  if (!value) return null;
  return `${value.toISOString().slice(0, -1)}000`;
}

export interface PublicNewsListItem {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  description: string | null;
  isHotNew: boolean;
  tags: string[] | null;
  shows: boolean;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}

/** Cột được `select` cho list — cố tình bỏ `content` (LongText) khỏi payload. */
export const PUBLIC_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  cover_image: true,
  description: true,
  is_hot_new: true,
  tags: true,
  shows: true,
  status: true,
  created_at: true,
  updated_at: true,
  created_by: true,
  updated_by: true,
} as const;

export type PublicListRow = Pick<
  news_articles,
  keyof typeof PUBLIC_LIST_SELECT & keyof news_articles
>;

export function toPublicNewsListItem(data: PublicListRow): PublicNewsListItem {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    coverImage: data.cover_image,
    description: data.description,
    isHotNew: data.is_hot_new ?? false,
    tags: parseTags(data.tags),
    shows: data.shows ?? true,
    status: data.status ?? "ACTIVE",
    createdAt: toNaiveDateTime(data.created_at),
    updatedAt: toNaiveDateTime(data.updated_at),
    createdBy: data.created_by,
    updatedBy: data.updated_by,
  };
}

export interface PublicNewsDetail {
  id: string;
  slug: string;
  title: string;
  coverImage: string | null;
  description: string | null;
  content: string | null;
  tags: string[] | null;
  status: string;
  isHotNew: boolean;
  ref: string | null;
  shows: boolean;
  createdAt: string | null;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

export function toPublicNewsDetail(data: news_articles): PublicNewsDetail {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    coverImage: data.cover_image,
    description: data.description,
    content: data.content,
    tags: parseTags(data.tags),
    status: data.status ?? "ACTIVE",
    isHotNew: data.is_hot_new ?? false,
    ref: data.ref,
    shows: data.shows ?? true,
    createdAt: toNaiveDateTime(data.created_at),
    createdBy: data.created_by,
    updatedAt: toNaiveDateTime(data.updated_at),
    updatedBy: data.updated_by,
  };
}
