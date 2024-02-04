import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import Product from '@/models/product';
import { updateStatusValidation } from "@/validation/product-validation";
import { validation } from "@/validation/validation";
const product = new Product();

export default async function handler(req, res) {
  try {  
    
    if (req.method !== "PATCH") {
      responseNotFound(res);
      return;
    }
    const { id } = req.query;
    const productId = validation(updateStatusValidation, id);
    const findProduct = await product.findId(productId);
    console.log("pro", productId, findProduct);
    if (!findProduct.length) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadGateway, ERROR_MESSAGE.ProductIdIsNull);
    }

    const dataUpdate = { active: findProduct[0].active === "Y" ? "N" : "Y" };
    await product.updateData({
      data: dataUpdate,
      where: { id: productId }
    })

    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: "ok"
    })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}
