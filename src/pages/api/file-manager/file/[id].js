import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { DIR_FILE_UPLOAD } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import { prismaClient } from "@/lib/prisma";
import { unlinkFile } from "@/lib/utils";

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
    const deleteFile = await prismaClient.fileManager.delete({
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

    if (!deleteFile) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FailedToDeleteFile);
    }

    const path = deleteFile.path;
    const src = `${DIR_FILE_UPLOAD}${path}${deleteFile.name}`

    await unlinkFile(src);

    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      message: "OK"
    });
  } catch (e) {
    responseErrorMessage(e, res)
  }
}