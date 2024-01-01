import { TFolderForm } from "@/components/features/file-manager/ModalForm";
import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { DIR_FILE_UPLOAD } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import { prismaClient } from "@/lib/prisma";
import { updateFolderNameValidation } from "@/validation/file-validation";
import { validation } from "@/validation/validation";
import { FileManager } from "@prisma/client";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {  
    
    if (req.method !== "PUT") {
      responseNotFound(res);
      return;
    }
    const { id } = req.query;
    if (!id) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest,ERROR_MESSAGE.FolderIsNotFound)
    }
    const payload = validation(updateFolderNameValidation, req.body);
    const findBySrc = await prismaClient.fileManager.count({
      where: {
        path: payload.path,
        name: payload.name
      }
    });

    if (findBySrc) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FolderAlreadyExists); 
    }
    
    const findById = await prismaClient.fileManager.findFirst({
      where: {
        id: +id,
        path: payload.path,
      }
    });
    console.log("find ", findById);

    // if folder not found
    if (!findById) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadGateway, ERROR_MESSAGE.FolderIsNotFound);
    }

    const updateFolderName = await prismaClient.fileManager.update({
      data: {
        name: payload.name
      },
      where: {
        id: +id
      }
    })
    if (!updateFolderName) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FailedToUpdateFolderName);
    }

    const updatePath = await bulkUpdatePathStartWith({
      payload,
      row: findById
    });
    if (!updatePath) {
      res.status(STATUS_MESSAGE_ENUM.Ok).json({
        message: "OK"
      })
      return;
    }

    await bulkUpdate(updatePath);

    const oldPath = `${DIR_FILE_UPLOAD}${findById.path}${findById.name}`;
    const newPath = `${DIR_FILE_UPLOAD}${findById.path}${payload.name}`;
    renameFolder(oldPath, newPath);

    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      message: "OK"
    })
  } catch (e:any) {
    responseErrorMessage(e, res);
  }
}

async function bulkUpdatePathStartWith({
  payload,
  row,
}: {
  payload: TFolderForm
  row: FileManager,
}) {
  
    const findPathContainsOldFolder = await prismaClient.fileManager.findMany({
      where: {
        path: {
          startsWith: `${row.path}${row.name}/`
        }
      }
    })

    console.log("findPathContainsOldFolder ", findPathContainsOldFolder);

    if (!findPathContainsOldFolder) return;

    const level = row.level;
    const updateMany: { id:number, path:string }[] = [];
    findPathContainsOldFolder.forEach((file) => {
      const splitPath = file.path.split("/").slice(1, -1);
      splitPath[level] = payload.name;
      updateMany.push({ id: file.id, path: `/${splitPath.join("/")}/` })
    });
  return updateMany;
}

function renameFolder(oldPath:string, newPath:string) {
  try {
    fs.renameSync(oldPath, newPath);
  } catch (e) {
    console.log("e", e);
    throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FailedToUpdateFolderName);
  }
}
async function bulkUpdate(rows:{ id:number, path:string }[]) {
  try {
    for (let i = 0; i < rows.length; i++) {
        await prismaClient.fileManager.update({
        data: {
          path: rows[i].path
        },
        where: {
          id: rows[i].id
        }
      });
    }

  } catch (e: any) {
    throw new ResponseError(STATUS_MESSAGE_ENUM.InternalServerError,ERROR_MESSAGE.FailedToUpdateFolderName)
  }
}