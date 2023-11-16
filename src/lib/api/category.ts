import { AxiosResponse } from "axios";
import { TResponseDataApi, getMethod, postMethod } from ".";
export type TParamCategory = {
  name?: string
}

export type TResponseDataCategory = {
  id: number,
  category_name: string,
}
 
export function getCategory(params?: TParamCategory): Promise<AxiosResponse<TResponseDataApi<TResponseDataCategory[]>>> {
  return getMethod("category",{ params });
}

type TPayloadCategory = {
  category_name: string
}
export function insertCategory(payload:TPayloadCategory) {
  return postMethod<TPayloadCategory>("category",payload);
}