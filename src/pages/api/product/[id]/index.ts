import { ResponseError, responseErrorMessage } from '@/errors/response-error';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { ERROR_MESSAGE } from '@/lib/message';
import { prismaClient } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    deleteProduct(req, res);
  }
}


async function deleteProduct(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.ProductIdIsNull);
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
  } catch (e: any) {
    responseErrorMessage(e, res)
  }
}
