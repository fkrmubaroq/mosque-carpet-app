import { prismaClient } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Product } from '@prisma/client';
import { ResponseError, responseErrorMessage, responseNotFound } from '@/errors/response-error';
import { validation } from '@/validation/validation';
import { insertProductValidation, updateProductValidation } from '@/validation/product-validation';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { OFFSET } from '@/lib/constant';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return post(req, res)
  }

  if (req.method === "GET") {
    return get(req,res);
  }
  
  if (req.method === "PUT") {
    return put(req,res);
  }

  responseNotFound(res);
}

async function put(req: NextApiRequest, res: NextApiResponse) {
  try {  
    const { id, ...payload } = validation(updateProductValidation, req.body);
    await prismaClient.product.update({
      data: payload,
      where: {
        id
      },
    });    
    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: "OK"
    })
  } catch (e:any) {
    responseErrorMessage(e, res);
  }
}
async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const validateRequest = validation(insertProductValidation, req.body);
    const insertProduct = await prismaClient.product.create({
      data: validateRequest
    });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: insertProduct
    })
  } catch (e:any) {
    responseErrorMessage(e, res);
  }

} 

async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = req.query;
    let filters = {};
    const page = query?.page ? +query.page : 1;
    const skip = (page - 1) * OFFSET;
    if (query?.name) {
      filters = {
        where: {
          name: {
            contains: query.name
          }
        }
      }
    }
    
    const response = await prismaClient.product.findMany({
      ...filters,
      include: {
        category: {
          select: {
            category_name: true
          }
        }
      },
      skip,
      take: OFFSET
    });

    const paginationInfo = await prismaClient.product.count({
      ...filters
    });

    const totalPage = Math.ceil(paginationInfo / OFFSET)

    const data = response.map(({
      category,
      ...rest
    }) => ({
      ...rest,
      category_name: category?.category_name
    }));
    res.status(200).json({
      data,
      paging: {
        page,
        total_page: totalPage,
        total_items: paginationInfo
      }
    })
  } catch (e: any) {
    res.status(400).json({
      message: e.message
    })
  }
}