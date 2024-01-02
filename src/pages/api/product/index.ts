import { prismaClient } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { responseErrorMessage, responseNotFound } from '@/errors/response-error';
import { validation } from '@/validation/validation';
import { insertProductValidation, updateProductValidation } from '@/validation/product-validation';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { DIR_FILE_PRODUCTS, OFFSET } from '@/lib/constant';
import multiparty from "multiparty";
import { incomingRequest } from '@/lib/utils';
import fs from "fs";
import { v4 as uuid } from "uuid";

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
      data: {
        ...payload,
        image:null,
      },
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
    const multipartyForm = new multiparty.Form();
    const { files, ...body } = await incomingRequest(multipartyForm, req);
    const request = { ...body };
    if (Object.keys(files).length) {
      request.image = files.image
    }
    
    const validateRequest = validation(insertProductValidation, request);
    const insertData = { ...validateRequest };
    const fileName = `${uuid().toString()}_${files?.image?.originalFilename}`;
    if (Object.keys(files).length) {
      insertData.image = fileName;
    }
    const insertProduct = await prismaClient.product.create({
      data: insertData
    });

    if (Object.keys(files).length) {
      const contentData = await fs.promises.readFile(files.image.path);
      const destination = `${DIR_FILE_PRODUCTS}/${fileName}`;
      await fs.promises.writeFile(destination, contentData);
    }

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
      orderBy: {
        id:"desc"
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
export const config = {
  api: {
    bodyParser: false
  }
}