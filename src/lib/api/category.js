import { getMethod, postMethod } from ".";

 
export function getCategory(params) {
  return getMethod("category",{ params });
}

export function insertCategory(payload) {
  return postMethod("category",payload);
}