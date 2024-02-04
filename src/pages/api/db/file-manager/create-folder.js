import { ResponseError, responseErrorMessage, responseNotFound } from '@/errors/response-error';
import { DIR_FILE_UPLOAD } from '@/lib/constant';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { ERROR_MESSAGE } from '@/lib/message';
import FileManager from '@/models/file';
import { createFolderValidation } from '@/validation/file-validation';
import { validation } from '@/validation/validation';
import fs from "fs";

const fileManager = new FileManager();

function createFolderAsync(folderName, src) {
  const dir = `${DIR_FILE_UPLOAD}${src}${folderName}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    return true;
  }

  return false;
}
 
export default async function handler(req, res) {
  try{
    if (req.method !== "POST") {
      responseNotFound(res);
      return;
    }
    const validateRequest = validation(createFolderValidation, req.body);
    const payload = {
      ...validateRequest,
      type: "FOLDER" ,
    }
    
    const folderAlreadyExists = await checkFolderIsAlreadyExist(validateRequest);
    if (folderAlreadyExists) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FolderAlreadyExists);
    }

    const levelBySlash = payload.path.split("/").length - 2;
    const data = {
      ...payload,
      level: payload.path === "/" ? 0 : levelBySlash
    };
    await fileManager.insertData(data);

    createFolderAsync(payload.name, payload.path);

    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: "ok"
    })

  } catch (e) {
    responseErrorMessage(e, res);
  }

}

async function checkFolderIsAlreadyExist({ path, name }) {
  const folderExists = await fileManager.countByPathAndFileName(path, name);

  return !!folderExists?.length;
}

