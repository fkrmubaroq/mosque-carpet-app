import { deleteMethod, getMethod, patchMethod, postMethod, putMethod } from ".";
import { objectIntoFormData } from "../utils";


 
export function insertProduct(payload) {
  const formPayload = objectIntoFormData(payload);
  return postMethod("product",formPayload);
}

export function updateProduct(payload) {
  const formPayload = objectIntoFormData(payload);
  return putMethod("product", formPayload);
}

export function getAllProduct(params) {
  return getMethod("product", { params });
}
export function getProductByCategory(categoryName) {
  return getMethod(`product/category/${categoryName}`);
}

export function deleteProduct(productId) {
  return deleteMethod(`product/${productId}`);
}

export function updateToggleStatus(productId) {
  return patchMethod(`product/${productId}/update-status`);
}