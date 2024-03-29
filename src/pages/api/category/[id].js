import { ResponseError, responseErrorMessage } from "@/errors/response-error";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import Category from "@/models/category";

const category = new Category();
export default function handler(req, res) {
  deleteRow(req, res);
}

async function deleteRow(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.ProductIdIsNull);
    }

    await category.deleteData({ id });

    res.status(200).json({
      message: "ok",
    })
  } catch (e) {
    responseErrorMessage(e, res)
  }
}

