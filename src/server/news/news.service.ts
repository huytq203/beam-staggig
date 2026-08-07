"server-only";

import { NotFoundError } from "src/lib/api/errors";
import {
  addNewArticle,
  deleteArticle,
  findAll,
  findById,
  findPagination,
  findPublicBySlug,
  findPublicPagination,
  setIsHotNew,
  setShows,
  updateArticle,
} from "./news.repository";
import { CreateNew, FindParams, PublicFindParams, UpdateNews } from "./types/type";

export async function getListNews() {
  return findAll();
}

export async function getListNewsWithPagination(params: FindParams) {
  return findPagination(params);
}

/** Danh sách cho landing page — chỉ bài ACTIVE + đang hiện, không kèm body. */
export async function getPublicNewsList(params: PublicFindParams) {
  return findPublicPagination(params);
}

/** Chi tiết cho landing page. Bài ẩn/DRAFT trả 404 như BE cũ. */
export async function getPublicNewsBySlug(slug: string) {
  const result = await findPublicBySlug(slug);
  if (!result) throw new NotFoundError("Không tìm thấy bài viết");
  return result;
}

export async function getNewsById(id: string) {
  const result = await findById(id);
  if (!result) throw new NotFoundError("Không tìm thấy bài viết");
  return result;
}

export async function createNewArticle(body: CreateNew, userId: string) {
  return addNewArticle(body, userId);
}

export async function updateNewsArticle(id: string, body: UpdateNews, userId: string) {
  return updateArticle(id, body, userId);
}

export async function deleteNewsArticle(id: string) {
  await deleteArticle(id);
}

export async function showNewsArticle(id: string) {
  return setShows(id, true);
}

export async function hideNewsArticle(id: string) {
  return setShows(id, false);
}

export async function showIsHotNewArticle(id: string) {
  return setIsHotNew(id, true);
}

export async function hideIsHotNewArticle(id: string) {
  return setIsHotNew(id, false);
}
