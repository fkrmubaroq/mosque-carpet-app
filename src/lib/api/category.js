import { deleteMethod, getMethod, postMethod, putMethod } from ".";
import { objectIntoFormData } from "../utils";

 
export function getCategory(params) {
  return getMethod("db/category",{ params });
}

export function insertCategory(payload) {
  const formPayload = objectIntoFormData(payload);
  return postMethod("db/category", formPayload);
}

export function updateCategory(payload) {
  const formPayload = objectIntoFormData(payload);
  return putMethod("db/category", formPayload);
}

export function deleteCategory(id) {
  return deleteMethod(`db/category/${id}`);
}

export function getCategoryBySlug(slug) {
  return getMethod(`db/category/slug/${slug}`);
}