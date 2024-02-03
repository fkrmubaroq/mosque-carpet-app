import { ResponseError, responseErrorMessage } from '@/errors/response-error';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { ERROR_MESSAGE } from '@/lib/message';
import Product from '@/models/product';
const product = new Product();
export default function handler(req, res) {
  if (req.method === "DELETE") {
    deleteProduct(req, res);
  }
}


async function deleteProduct(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.ProductIdIsNull);
    }
    await product.deleteData({ id });

    res.status(200).json({
      message: "ok",
    })
  } catch (e) {
    responseErrorMessage(e, res)
  }
}
