import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const instance = axios.create({
  withCredentials: true,
  baseURL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export type TStatus = "Y" | "N";
export type TPaging = {
  page: number,
  total_page: number,
  total_items: number
}
export type TResponseDataApi<TData> = {
  data: TData,
}
export type TResponseErrorApi = {
  code: number,
  message: string
}
export type TResponseDataApiWithPagination<TData> = {
  data: TData,
  paging: TPaging
}
export function getMethod<TData>(endpoint:string, config?: AxiosRequestConfig): Promise<AxiosResponse<TData>> {
  return instance.get(endpoint, config);
}

export function postMethod<TPayloadPost>(endpoint:string, payload?:TPayloadPost, config?: AxiosRequestConfig): Promise<AxiosResponse>{
  return instance.post(endpoint, payload, config);
}

export function putMethod<TPayloadPut>(endpoint:string, payload?:TPayloadPut, config?:AxiosRequestConfig): Promise<AxiosResponse> {
  return instance.put(endpoint, payload, config);
}
export function patchMethod<TPayloadPut>(endpoint:string, payload?:TPayloadPut, config?:AxiosRequestConfig): Promise<AxiosResponse> {
  return instance.patch(endpoint, payload, config);
}

export function deleteMethod(endpoint:string, config?:AxiosRequestConfig): Promise<AxiosResponse> {
  return instance.delete(endpoint, config);
}


export { instance };

