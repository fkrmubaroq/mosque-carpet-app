import { deleteMethod, getMethod, postMethod, putMethod } from ".";

export function getFileItems(params) {
  return getMethod("db/file-manager", { params });
}

export function createFolder(payload) {
  return postMethod("db/file-manager/create-folder", payload);
}

function appendPayload(payload) {
  const data = new FormData();
  
  data.append("path", payload.path);
  const files = payload.files;
  for (let i = 0; i < payload.files.length; i++){
    data.append(`file[${i}]`,files[i]);
  } 
  return data;
}

export function uploadFiles(payload){
  const data = appendPayload(payload);
  return postMethod("db/file-manager/upload-file", data);
}

export function updateFolderName(id, payload){
  return putMethod(`db/file-manager/${id}/update-folder-name`, payload);
}
export function updateFileName(id, payload){
  return putMethod(`db/file-manager/${id}/update-file-name`, payload);
}

export function deleteFolder(id){
  return deleteMethod(`db/file-manager/folder/${id}`);
}

export function deleteFile(id) {
  return deleteMethod(`db/file-manager/file/${id}`);
}

export function downloadFile(src) {
  return getMethod(`db/file-manager/download/${src}`);
}