import { ResponseError, responseErrorMessage } from "@/errors/response-error";
import { ERROR_MESSAGE, STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { prismaClient } from "@/lib/prisma";

export default function handler(req, res) {
  deleteRow(req, res);
}

async function deleteRow(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.ProductIdIsNull);
    }

    await prismaClient.category.delete({
      where: {
        id: +id
      }
    });

    res.status(200).json({
      message: "ok",
    })
  } catch (e) {
    responseErrorMessage(e, res)
  }
}

