import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const instance = axios.create({
  withCredentials: true,
  baseURL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export type ToggleStatus = 0 | 1;
export type ParamGetAll = {
  offset?: number;
}

export type DateTime = {
  Time: string,
  Valid: boolean
};
export function getMethod<TData>(endpoint:string, config?: AxiosRequestConfig): Promise<AxiosResponse<TData>> {
  return instance.get(endpoint, config);
}

export function postMethod<TPayloadPost>(endpoint:string, payload?:TPayloadPost, config?: AxiosRequestConfig): Promise<AxiosResponse>{
  return instance.post(endpoint, payload, config);
}

export function putMethod<TPayloadPut>(endpoint:string, payload?:TPayloadPut, config?:AxiosRequestConfig): Promise<AxiosResponse> {
  return instance.put(endpoint, payload, config);
}

export function deleteMethod(endpoint:string, config?:AxiosRequestConfig): Promise<AxiosResponse> {
  return instance.delete(endpoint, config);
}

export { instance };

