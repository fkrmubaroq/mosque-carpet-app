import { ResponseError, responseErrorMessage } from '@/errors/response-error';
import { DIR_FILE_PRODUCTS } from '@/lib/constant';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { ERROR_MESSAGE } from '@/lib/message';
import { prismaClient } from '@/lib/prisma';
import { unlinkFile } from '@/lib/utils';

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
    const prevImage = await prismaClient.product.findFirst({
      where: {
        id: +id
      },
    });  
    if (prevImage) {
      const destinationFileUnlink = `${DIR_FILE_PRODUCTS}/${prevImage.image}`;
      await unlinkFile(destinationFileUnlink);
    }
    const deleteProduct = await prismaClient.product.delete({
      where: {
        id:+id
      }
    });

    console.log("deleteProduct ", deleteProduct);
    res.status(200).json({
      message: "ok",
    })
  } catch (e) {
    responseErrorMessage(e, res)
  }
}
