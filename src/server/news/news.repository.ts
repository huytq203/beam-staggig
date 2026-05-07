"server-only";

import crypto from "crypto";
import { ApiResponse, toApiRestponse } from "src/lib/response-api/response";
import { NewsResponse, toNewsEntity, toNewsResponse } from "./news.entity";
import { CreateNew, FindParams, UpdateNews } from "./types/type";
import { prisma } from "src/lib/prisma/prisma";

export async function findAll() {
  const rows = await prisma.news_articles.findMany({
    where: {},
    orderBy: { created_at: "desc" },
  });
  return rows.map(toNewsResponse);
}

export async function findPagination(params: FindParams): Promise<ApiResponse<NewsResponse>> {
  const { page = 1, pageSize = 10, title } = params;
  const [rows, total] = await prisma.$transaction([
    prisma.news_articles.findMany({
      where: { ...(title ? { title: { contains: title } } : {}) },
      orderBy: { created_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.news_articles.count({ where: { shows: true } }),
  ]);
  return toApiRestponse(rows, total, page, pageSize, toNewsResponse);
}

export async function findById(id: string) {
  const row = await prisma.news_articles.findUnique({ where: { id} });
  return row ? toNewsResponse(row) : null;
}

export async function addNewArticle(body: CreateNew): Promise<NewsResponse> {
  const now = new Date();
  const entity = toNewsEntity(body);
  const result = await prisma.news_articles.create({
    data: {
      ...entity,
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
    },
  });
  return toNewsResponse(result);
}

export async function updateArticle(id: string, body: UpdateNews): Promise<NewsResponse> {
  const entity = toNewsEntity(body);
  const result = await prisma.news_articles.update({
    where: { id },
    data: { ...entity, updated_at: new Date() },
  });
  return toNewsResponse(result);
}

export async function deleteArticle(id: string): Promise<void> {
  await prisma.news_articles.delete({ where: { id } });
}

export async function setShows(id: string, shows: boolean): Promise<NewsResponse> {
  const result = await prisma.news_articles.update({
    where: { id },
    data: { shows, updated_at: new Date() },
  });
  return toNewsResponse(result);
}

export async function setIsHotNew(id: string, is_hot_new: boolean): Promise<NewsResponse> {
  const result = await prisma.news_articles.update({
    where: { id },
    data: { is_hot_new, updated_at: new Date() },
  });
  return toNewsResponse(result);
}