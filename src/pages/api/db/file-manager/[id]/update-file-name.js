import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { DIR_FILE_UPLOAD } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import FileManager from "@/models/file";
import { updateFileNameValidation } from "@/validation/file-validation";
import { validation } from "@/validation/validation";
import fs from "fs";

const fileManager = new FileManager();
export default async function handler(req, res) {
  try {

    if (req.method !== "PUT") {
      responseNotFound(res);
      return;
    }
    const { id } = req.query;
    if (!id) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FolderIsNotFound)
    }
    const payload = validation(updateFileNameValidation, req.body);
    const extension = getFileExtension(payload.name)?.toLowerCase();
    const allowExtension = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'tiff', 'webp'];
    if (!allowExtension.includes(extension)) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.ExtensionFileIsUnknown)
    }
    
    const findBySrc = await fileManager.countByPathAndFileName(payload.path, payload.name)

    if (findBySrc) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FileAlreadyExists);
    }

    const findById = await fileManager.findIdAndPath(id, payload.path);

    console.log("findById", id, payload);
    // if folder not found
    if (!findById?.length) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadGateway, ERROR_MESSAGE.FileIsNotFound);
    }

    const data = {
      name: payload.name
    };
    const updateFileName = await fileManager.updateData({ data, where: { id } });
    if (!updateFileName?.changedRows) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FailedToUpdateFolderName);
    }

    const resultFile = findById[0];
    const oldPath = `${DIR_FILE_UPLOAD}${resultFile.path}${resultFile.name}`;
    const newPath = `${DIR_FILE_UPLOAD}${resultFile.path}${payload.name}`;
    renameFile(oldPath, newPath);

    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      message: "OK"
    })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}

function renameFile(oldPath, newPath) {
  try {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FailedToUpdateFileName)
      }
    });
  } catch (e) {
    throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FailedToUpdateFileName);
  }
}

function getFileExtension(filename) {
  const extension = filename.split('.').pop();
  return extension;
}