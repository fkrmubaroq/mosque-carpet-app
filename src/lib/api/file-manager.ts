import { AxiosResponse } from "axios";
import { TResponseDataApi, getMethod, postMethod } from ".";
import { TYPE_MANAGER } from "@prisma/client";

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
 
export type TPayloadFolder = {
  name: string,
  path: string
}
export function getFileItems(params?: TParamProduct): Promise<AxiosResponse<TResponseDataApi<TResponseFileItem[]>>> {
  return getMethod("file-manager", { params });
}

export function createFolder(payload: TPayloadFolder): Promise<AxiosResponse<TResponseDataApi<TResponseFileItem[]>>> {
  return postMethod("file-manager/create-folder", payload);
}
