import { TResponseDataApi } from "@/types/api";
import { getMethod, postMethod } from ".";
import { TResponseDataCategory } from "@/types/api/category";
export type TParamCategory = {
  name?: string
}
export function getCategory(params?: TParamCategory) {
  return getMethod<TResponseDataApi<TResponseDataCategory[]>>("category",{ params });
}

type TPayloadCategory = {
}
export function insertCategory(payload:TPayloadCategory) {
  return postMethod<TResponseDataApi<TResponseDataCategory>>("category",payload);
}