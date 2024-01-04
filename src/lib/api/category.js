import { deleteMethod, getMethod, postMethod, putMethod } from ".";
import { objectIntoFormData } from "../utils";

 
export function getCategory(params) {
  return getMethod("category",{ params });
}

export function insertCategory(payload) {
  const formPayload = objectIntoFormData(payload);
  return postMethod("category", formPayload);
}

export function updateCategory(payload) {
  const formPayload = objectIntoFormData(payload);
  return putMethod("category", formPayload);
}

export function deleteCategory(id) {
  return deleteMethod(`category/${id}`);
}