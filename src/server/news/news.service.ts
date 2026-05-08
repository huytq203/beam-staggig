"server-only";

import { addNewArticle, deleteArticle, findAll, findById, findPagination, setIsHotNew, setShows, updateArticle } from "./news.repository";
import { CreateNew, FindParams, UpdateNews } from "./types/type";

export async function getListNews() {
  return findAll();
}
export async function getListNewsWithPagination(params: FindParams) {
  return findPagination(params);
}

export async function getNewsById(id: string) {
  const result = await findById(id);
  if (!result) {
    throw new Error("Không tìm thấy bài viết");
  }
  return result;
}

export async function createNewArticle(body:CreateNew) {
  const result = await addNewArticle(body);
  if(!result){
    throw new Error("Không thêm được bài viết");
  }
  return result;
}

export async function updateNewsArticle(id: string, body: UpdateNews) {
  await getNewsById(id);
  return updateArticle(id, body);
}

export async function deleteNewsArticle(id: string) {
  await getNewsById(id);
  await deleteArticle(id);
}

export async function showNewsArticle(id: string) {
  await getNewsById(id);
  return setShows(id, true);
}

export async function hideNewsArticle(id: string) {
  await getNewsById(id);
  return setShows(id, false);
}

export async function showIsHotNewArticle(id: string) {
  await getNewsById(id);
  return setIsHotNew(id, true);
}

export async function hideIsHotNewArticle(id: string) {
  await getNewsById(id);
  return setIsHotNew(id, false);
}