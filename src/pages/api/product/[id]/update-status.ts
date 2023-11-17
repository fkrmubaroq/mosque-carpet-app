import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import { prismaClient } from "@/lib/prisma";
import { updateStatusValidation } from "@/validation/product-validation";
import { validation } from "@/validation/validation";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {  
    
    if (req.method !== "PATCH") {
      responseNotFound(res);
      return;
    }
    const { id } = req.query;
    const productId = validation(updateStatusValidation, id);
    const findProduct = await prismaClient.product.findUnique({ where: { id: productId }, select: { id: true, active:true } });
    if (!findProduct) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadGateway, ERROR_MESSAGE.ProductIdIsNull);
    }

    const data = await prismaClient.product.update({
      data: {
        active: findProduct.active === "Y" ? "N" : "Y"
      },
      where: {
        id: productId
      },
      select: {
        id: true,
        active: true
      }
    })
    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data
    })
  } catch (e:any) {
    responseErrorMessage(e, res);
  }
}
