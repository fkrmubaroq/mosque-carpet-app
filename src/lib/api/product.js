import { deleteMethod, getMethod, patchMethod, postMethod, putMethod } from ".";


 
export function insertProduct(payload) {
  return postMethod("db/product",payload);
}

export function updateProduct(payload) {
  return putMethod("db/product", payload);
}

export function getAllProduct(params) {
  return getMethod("db/product", { params });
}
export function getProductByCategory(categoryName) {
  return getMethod(`db/product/category/${categoryName}`);
}
export function getProductByName(name) {
  return getMethod(`db/product/name/${name}`);
}

export function deleteProduct(productId) {
  return deleteMethod(`db/product/${productId}`);
}

export function updateToggleStatus(productId) {
  return patchMethod(`db/product/${productId}/update-status`);
}
