import { AxiosResponse } from "axios";
import { TResponseDataApi, getMethod } from ".";

type TParamProduct = {
  path?: string
}
export type TFileType = "FILE" | "FOLDER";
export type TResponseFileItem =  {
  id: number,
  type:TFileType,
  name: string,
  path: string
}
 
export function getFileItems(params?: TParamProduct): Promise<AxiosResponse<TResponseDataApi<TResponseFileItem[]>>> {
  return getMethod("file-manager", { params });
}
