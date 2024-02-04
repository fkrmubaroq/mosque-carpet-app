import { deleteMethod, getMethod, patchMethod, postMethod, putMethod } from ".";


 
export function insertProduct(payload) {
  return postMethod("product",payload);
}

export function updateProduct(payload) {
  return putMethod("product", payload);
}

export function getAllProduct(params) {
  return getMethod("product", { params });
}
export function getProductByCategory(categoryName) {
  return getMethod(`product/category/${categoryName}`);
}
export function getProductByName(name) {
  return getMethod(`product/name/${name}`);
}

export function deleteProduct(productId) {
  return deleteMethod(`product/${productId}`);
}

export function updateToggleStatus(productId) {
  return patchMethod(`product/${productId}/update-status`);
}
