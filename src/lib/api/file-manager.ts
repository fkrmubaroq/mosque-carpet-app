import { AxiosResponse } from "axios";
import { TResponseDataApi, deleteMethod, getMethod, patchMethod, postMethod, putMethod } from ".";
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

export type TPayloadUploadFile = {
  files: FileList;
  path: string;
}

function appendPayload(payload: TPayloadUploadFile) {
  const data = new FormData();
  
  data.append("path", payload.path);
  const files = payload.files;
  for (let i = 0; i < payload.files.length; i++){
    data.append(`file[${i}]`,files[i]);
  } 
  return data;
}

export function uploadFiles(payload: TPayloadUploadFile): Promise<AxiosResponse<TResponseDataApi<TResponseFileItem[]>>> {
  const data = appendPayload(payload);
  return postMethod("file-manager/upload-file", data);
}

export function updateFolderName(id:number, payload:{ name: string }): Promise<AxiosResponse<TResponseDataApi<TResponseFileItem[]>>> {
  return putMethod(`file-manager/${id}/update-folder-name`, payload);
}

export function deleteFolder(id: number): Promise<AxiosResponse<TResponseDataApi<TResponseFileItem[]>>> {
  return deleteMethod(`file-manager/${id}`);
}
