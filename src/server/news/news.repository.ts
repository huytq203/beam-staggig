"server-only";

import { Prisma } from "@prisma/client";
import crypto from "crypto";
import { NotFoundError } from "src/lib/api/errors";
import { prisma } from "src/lib/prisma/prisma";
import { ApiResponse, toApiRestponse } from "src/lib/response-api/response";
import { SpringPage, toSpringPage } from "src/lib/response-api/springPage";
import {
  NewsResponse,
  PUBLIC_LIST_SELECT,
  PublicNewsDetail,
  PublicNewsListItem,
  toNewsEntity,
  toNewsResponse,
  toPublicNewsDetail,
  toPublicNewsListItem,
} from "./news.entity";
import { CreateNew, FindParams, PublicFindParams, UpdateNews } from "./types/type";

const MAX_PAGE_SIZE = 100;

function clampPageSize(size: number): number {
  return Math.min(Math.max(Math.floor(size) || 10, 1), MAX_PAGE_SIZE);
}

export async function findAll(limit = 50): Promise<NewsResponse[]> {
  const rows = await prisma.news_articles.findMany({
    orderBy: { created_at: "desc" },
    take: Math.min(limit, MAX_PAGE_SIZE),
  });
  return rows.map(toNewsResponse);
}

export async function findPagination(params: FindParams): Promise<ApiResponse<NewsResponse>> {
  const page = Math.max(Math.floor(params.page ?? 1), 1);
  const pageSize = clampPageSize(params.pageSize ?? 10);
  const where: Prisma.news_articlesWhereInput = params.title
    ? { title: { contains: params.title } }
    : {};

  const [rows, total] = await prisma.$transaction([
    prisma.news_articles.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.news_articles.count({ where }),
  ]);
  return toApiRestponse(rows, total, page, pageSize, toNewsResponse);
}

export async function findById(id: string): Promise<NewsResponse | null> {
  const row = await prisma.news_articles.findUnique({ where: { id } });
  return row ? toNewsResponse(row) : null;
}

/**
 * Chỉ bài đã phát hành và đang bật hiển thị.
 * `shows` dùng `not: false` thay vì `true` để row cũ có giá trị NULL vẫn hiện —
 * khớp với cách `toNewsResponse` mặc định `shows ?? true`.
 */
const PUBLIC_WHERE: Prisma.news_articlesWhereInput = {
  status: "ACTIVE",
  shows: { not: false },
};

export async function findPublicPagination(
  params: PublicFindParams
): Promise<SpringPage<PublicNewsListItem>> {
  const page = Math.max(Math.floor(params.page ?? 1), 1);
  const size = clampPageSize(params.size ?? 10);
  const where: Prisma.news_articlesWhereInput = params.name
    ? { ...PUBLIC_WHERE, title: { contains: params.name } }
    : PUBLIC_WHERE;

  const [rows, total] = await prisma.$transaction([
    prisma.news_articles.findMany({
      where,
      select: PUBLIC_LIST_SELECT,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * size,
      take: size,
    }),
    prisma.news_articles.count({ where }),
  ]);
  return toSpringPage(rows, total, page, size, toPublicNewsListItem);
}

export async function findPublicBySlug(slug: string): Promise<PublicNewsDetail | null> {
  const row = await prisma.news_articles.findFirst({ where: { ...PUBLIC_WHERE, slug } });
  return row ? toPublicNewsDetail(row) : null;
}

export async function addNewArticle(body: CreateNew, userId: string): Promise<NewsResponse> {
  const now = new Date();
  const entity = toNewsEntity(body);
  try {
    const result = await prisma.news_articles.create({
      data: {
        ...(entity as Prisma.news_articlesCreateInput),
        title: body.title,
        slug: body.slug,
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now,
        created_by: userId,
        updated_by: userId,
      },
    });
    return toNewsResponse(result);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error("Slug đã tồn tại");
    }
    throw err;
  }
}

export async function updateArticle(
  id: string,
  body: UpdateNews,
  userId: string
): Promise<NewsResponse> {
  const entity = toNewsEntity(body);
  try {
    const result = await prisma.news_articles.update({
      where: { id },
      data: { ...entity, updated_at: new Date(), updated_by: userId },
    });
    return toNewsResponse(result);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") throw new NotFoundError("Không tìm thấy bài viết");
      if (err.code === "P2002") throw new Error("Slug đã tồn tại");
    }
    throw err;
  }
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    await prisma.news_articles.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new NotFoundError("Không tìm thấy bài viết");
    }
    throw err;
  }
}

export async function setShows(id: string, shows: boolean): Promise<NewsResponse> {
  try {
    const result = await prisma.news_articles.update({
      where: { id },
      data: { shows, updated_at: new Date() },
    });
    return toNewsResponse(result);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new NotFoundError("Không tìm thấy bài viết");
    }
    throw err;
  }
}

export async function setIsHotNew(id: string, is_hot_new: boolean): Promise<NewsResponse> {
  try {
    const result = await prisma.news_articles.update({
      where: { id },
      data: { is_hot_new, updated_at: new Date() },
    });
    return toNewsResponse(result);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new NotFoundError("Không tìm thấy bài viết");
    }
    throw err;
  }
}
