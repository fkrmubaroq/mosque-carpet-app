import { TResponseDataApi, TResponseDataApiWithPagination, TStatus, deleteMethod, getMethod, patchMethod, postMethod, putMethod } from ".";
import { AxiosResponse } from "axios";

export type TPayloadProduct = {
  name: string,
  description: string,
  price?: number,
  stock?: number,
  category_id: number,
  image?: File,
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
  active: TStatus,
  image: string,
}

function objectIntoFormData(payload:any) {
  const form = new FormData();
  for (const key in payload) {
    form.append(key, payload[key]);
  }
  return form;
  
}
 
export function insertProduct(payload: TPayloadProduct) {
  const formPayload = objectIntoFormData(payload);
  return postMethod("product",formPayload);
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