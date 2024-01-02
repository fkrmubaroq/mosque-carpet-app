import { deleteMethod, getMethod, postMethod, putMethod } from ".";

 
export function getCategory(params) {
  return getMethod("category",{ params });
}

export function insertCategory(payload) {
  return postMethod("category",payload);
}

export function updateCategory(payload) {
  return putMethod("category",payload);
}

export function deleteCategory(id) {
  return deleteMethod(`category/${id}`);
}