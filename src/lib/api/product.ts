import { TResponseDataApi, TResponseDataApiWithPagination, TStatus, deleteMethod, getMethod, patchMethod, postMethod, putMethod } from ".";
import { AxiosResponse } from "axios";

export type TPayloadProduct = {
  name: string,
  description: string,
  price?: number,
  stock?: number,
  category_id: number,
  image?: string,
  active: TStatus
}
export type TResponseDataProduct = {
  id: number,
  name: string,
  description: string,
  price: number,
  stock: number,
  category_id: number,
  category_name: string,
  active: TStatus
}
 
export function insertProduct(payload:TPayloadProduct) {
  return postMethod("product",payload);
}

export function updateProduct(payload:TPayloadProduct) {
  return putMethod("product",payload);
}

export type TParamProduct = {
  name?: string,
}
export function getAllProduct(params?: TParamProduct): Promise<AxiosResponse<TResponseDataApiWithPagination<TResponseDataProduct[]>>> {
  return getMethod("product", { params });
}

export function deleteProduct(productId: number) {
  return deleteMethod(`product/${productId}`);
}

export function updateToggleStatus(productId: number) {
  return patchMethod(`product/${productId}/update-status`);
}