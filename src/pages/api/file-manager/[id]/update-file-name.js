import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { DIR_FILE_UPLOAD } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import { prismaClient } from "@/lib/prisma";
import { updateFileNameValidation } from "@/validation/file-validation";
import { validation } from "@/validation/validation";
import fs from "fs";

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
    const findBySrc = await prismaClient.fileManager.count({
      where: {
        path: payload.path,
        name: payload.name
      }
    });

    if (findBySrc) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FileAlreadyExists);
    }

    const findById = await prismaClient.fileManager.findFirst({
      where: {
        id: +id,
        path: payload.path,
      }
    });

    // if folder not found
    if (!findById) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadGateway, ERROR_MESSAGE.FileIsNotFound);
    }

    const updateFileName = await prismaClient.fileManager.update({
      data: {
        name: payload.name
      },
      where: {
        id: +id
      }
    })
    if (!updateFileName) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FailedToUpdateFolderName);
    }

    const oldPath = `${DIR_FILE_UPLOAD}${findById.path}${findById.name}`;
    const newPath = `${DIR_FILE_UPLOAD}${findById.path}${payload.name}`;
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