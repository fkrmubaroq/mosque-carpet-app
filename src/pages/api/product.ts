import { RESPONSE_API_MESSAGE } from '@/lib/message'
import { prismaClient } from '@/lib/prisma'
import { ApiMessage, TResponseDataApi } from '@/types/api'
import { TResponseDataCategory } from '@/types/api/category'
import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Product } from '@prisma/client';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": postProduct(req,res)
  }
}
async function postProduct(req: NextApiRequest, res: NextApiResponse) {
  const body:Product = req.body;
  try {
  const payload = {
    name: body.name,
    description: body.description,
    price: +body?.price || 0,
    stock: +body?.stock || 0,
    category_id: +body.category_id,
    image: body?.image || null
  }
  const insertProduct = await prismaClient.product.create({
    data: payload
  });
  res.status(200).json({
    code: +ApiMessage.StatusOk,
    message: RESPONSE_API_MESSAGE[ApiMessage.StatusOk],
    data: insertProduct
  })
  } catch (e) {

    res.status(400).json({
      code: +ApiMessage.ErrorMessage,
      message: RESPONSE_API_MESSAGE[ApiMessage.ErrorMessage],
    }) 
  }

} 