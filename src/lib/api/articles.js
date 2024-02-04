import { deleteMethod, getMethod, postMethod, putMethod } from ".";
import { objectIntoFormData } from "../utils";

export function getArticle(params) {
  return getMethod("db/article", { params });
}

export function createArticle(payload) {
  const formPayload = objectIntoFormData(payload);
  return postMethod("db/article", formPayload);
}
export function updateArticle(id,payload) {
  const formPayload = objectIntoFormData(payload);
  return putMethod(`db/article/${id}`, formPayload);
}

export function getArticleById(id) {
  return getMethod(`db/article/${id}`);
}

export function getArticleBySlug(slug) {
  return getMethod(`db/article/slug/${slug}`);
}

export function deleteArticle(id) {
  return deleteMethod(`db/article/${id}`);
}
