import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { DIR_FILE_UPLOAD } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import { prismaClient } from "@/lib/prisma";
import fs from "fs";

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
    const deleteFolder = await prismaClient.fileManager.delete({
      where: {
        id: +id
      },
      select: {
        id: true,
        path: true,
        name: true,
        level: true
      }
    });
    
    if (!deleteFolder) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FailedToDeleteFolder);
    }
    
    const fileId = deleteFolder.id;
    const findByPath = await prismaClient.fileManager.findMany({
      where: {
        path: {
          startsWith: `${deleteFolder.path}${deleteFolder.name}/`
        }
      }
    });


    const folderName = deleteFolder.name;
    const path = deleteFolder.path;
    const src = `${DIR_FILE_UPLOAD}${path}${folderName}`

    deleteFolderAsync(src, { recursive: true , force: true });
    
    const listIds = findByPath.map(item => item.id);
    await prismaClient.fileManager.deleteMany({
      where: {
        id: {
          in:listIds
        }
      }  
    });

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