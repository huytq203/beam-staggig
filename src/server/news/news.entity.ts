"server-only";

import { news_articles, Prisma } from "@prisma/client";

export interface NewsResponse {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  description: string | null;
  content?: string | null;
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
  if (data.isHotNew !== undefined) entity.is_hot_new = data.isHotNew;
  if (data.tags !== undefined) entity.tags = data.tags === null ? Prisma.JsonNull : data.tags;
  if (data.shows !== undefined) entity.shows = data.shows;
  if (data.status !== undefined) entity.status = data.status;
  return entity;
}
