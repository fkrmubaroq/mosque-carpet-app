import { ResponseError, responseErrorMessage, responseNotFound } from '@/errors/response-error';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { ERROR_MESSAGE } from '@/lib/message';
import { prismaClient } from '@/lib/prisma';
import { TFolderForm, createFolderValidation } from '@/validation/file-validation';
import { validation } from '@/validation/validation';
import { TYPE_MANAGER } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
 
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
    const createFolder = await prismaClient.fileManager.create({
      data: payload,
      select: {
        id: true,
        path: true,
        name: true,
        type: true
      }
    })

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