"server-only";

import { NotFoundError } from "src/lib/api/errors";
import {
  addNewArticle,
  deleteArticle,
  findAll,
  findById,
  findPagination,
  setIsHotNew,
  setShows,
  updateArticle,
} from "./news.repository";
import { CreateNew, FindParams, UpdateNews } from "./types/type";

export async function getListNews() {
  return findAll();
}

export async function getListNewsWithPagination(params: FindParams) {
  return findPagination(params);
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
