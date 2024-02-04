import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { unlinkFile } from "@/lib/api/utils";
import { DIR_FILE_UPLOAD } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import FileManager from "@/models/file";

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
    if (!checkId.length) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.FailedToDeleteFile);
    }

    await fileManager.deleteData({ id });

    const resultFile = checkId[0];
    const path = resultFile.path;
    const src = `${DIR_FILE_UPLOAD}${path}${resultFile.name}`

    await unlinkFile(src);

    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      message: "OK"
    });
  } catch (e) {
    responseErrorMessage(e, res)
  }
}