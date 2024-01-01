import { ResponseError, responseErrorMessage, responseNotFound } from '@/errors/response-error';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { ERROR_MESSAGE } from '@/lib/message';
import { prismaClient } from '@/lib/prisma';
import { createFolderValidation } from '@/validation/file-validation';
import { TFolderForm } from '@/components/features/file-manager/ModalForm';
import { validation } from '@/validation/validation';
import { TYPE_MANAGER } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from "fs";
import { DIR_FILE_UPLOAD } from '@/lib/constant';

function createFolderAsync(folderName: string, src: string) {
  const dir = `${DIR_FILE_UPLOAD}${src}${folderName}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    return true;
  }

  return false;
}
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try{
    if (req.method !== "POST") {
      responseNotFound(res);
      return;
    }
    const validateRequest = validation(createFolderValidation, req.body);
    const payload = {
      ...validateRequest,
      type: "FOLDER" as TYPE_MANAGER,
    }
    
    const folderAlreadyExists = await checkFolderIsAlreadyExist(validateRequest);
    if (folderAlreadyExists) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FolderAlreadyExists);
    }

    const levelBySlash = payload.path.split("/").length - 2;
    const createFolder = await prismaClient.fileManager.create({
      data: {
        ...payload,
        level: payload.path === "/" ? 0 : levelBySlash
      },
      select: {
        id: true,
        path: true,
        name: true,
        type: true,
        level: true
      }
    });

    createFolderAsync(payload.name, payload.path);

    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: createFolder
    })

  } catch (e:any) {
    responseErrorMessage(e, res);
  }

}

async function checkFolderIsAlreadyExist({ path, name }:TFolderForm) {
  const folderExists = await prismaClient.fileManager.count({
    where: {
      path,
      name
    }
  });

  return !!folderExists 
}

