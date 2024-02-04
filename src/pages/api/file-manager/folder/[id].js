import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { DIR_FILE_UPLOAD } from "@/lib/constant";
import query from "@/lib/db";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import FileManager from "@/models/file";
import fs from "fs";

const fileManager = new FileManager();
export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (req.method !== "DELETE") {
      responseNotFound(res);
      return;
    }
    if (!id) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.ProductIdIsNull);      
    }
    const checkId = await fileManager.findId(id);
    if (!checkId?.length) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FailedToDeleteFolder);
    }
    await fileManager.deleteData({ id });
    const resultFind = checkId[0]; 
    
    const findByPath = await fileManager.findPathContains(`${resultFind.path}${resultFind.name}/`);

    const folderName = resultFind.name;
    const path = resultFind.path;
    const src = `${DIR_FILE_UPLOAD}${path}${folderName}`

    deleteFolderAsync(src, { recursive: true , force: true });
    
    const listIds = findByPath.map(item => item.id);
    await query(`DELETE FROM file_manager WHERE file_manager.id IN (${listIds.join(', ')})`)

    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      message: "OK"
    });
  } catch (e) {
    responseErrorMessage(e,res)
  }
}

function deleteFolderAsync(srcPath, options) {
  if (!fs.existsSync(srcPath)) return false;

  fs.rmdirSync(srcPath,options);
  return true;
}