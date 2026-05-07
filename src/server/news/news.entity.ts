"server-only";

import { news_articles } from "@prisma/client";


export interface NewsResponse {
  id:string;
  title:string;
  slug:string;
  coverImage:string|null;
  description:string |null;
  content?:string |null;
  isHotNew:boolean;
  tags:string | null;
  shows:boolean;
  status:string;
  createdAt:Date|string;
  updatedAt:Date|string;
  createdBy:string|null;
  updatedBy:string|null;
  
}
export function toNewsResponse(data: news_articles): NewsResponse {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    coverImage: data.cover_image,
    description: data.description,
    content: data.content,
    isHotNew: data.is_hot_new ?? false, // Xử lý giá trị default nếu null
    tags: data.tags as string | null,
    shows:data.shows as boolean,
    status: data.status ?? "ACTIVE",
    createdAt: data.created_at?.toISOString() ?? "",
    updatedAt: data.updated_at?.toISOString() ?? "",
    createdBy:data.created_by,
    updatedBy:data.updated_by
  };
}

export function toNewsEntity(data: any): any {
  return {
    title: data.title,
    slug: data.slug,
    cover_image: data.coverImage ?? null,
    description: data.description ?? null,
    content: data.content ?? null,
    is_hot_new: data.isHotNew ?? false,
    tags: data.tags ?? null,
    shows: data.shows ?? true,
    status: data.status ?? "ACTIVE",
    created_by: data.createdBy ?? null,
    updated_by: data.updatedBy ?? null,
  };
}