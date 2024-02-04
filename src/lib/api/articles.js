import { deleteMethod, getMethod, postMethod, putMethod } from ".";
import { objectIntoFormData } from "../utils";

export function getArticle(params) {
  return getMethod("article", { params });
}

export function createArticle(payload) {
  const formPayload = objectIntoFormData(payload);
  return postMethod("article", formPayload);
}
export function updateArticle(id,payload) {
  const formPayload = objectIntoFormData(payload);
  return putMethod(`article/${id}`, formPayload);
}

export function getArticleById(id) {
  return getMethod(`article/${id}`);
}

export function getArticleBySlug(slug) {
  return getMethod(`article/slug/${slug}`);
}

export function deleteArticle(id) {
  return deleteMethod(`article/${id}`);
}
