import { responseErrorMessage, responseNotFound } from '@/errors/response-error';
import { OFFSET } from '@/lib/constant';
import { insert, update } from '@/lib/db';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { prismaClient } from '@/lib/prisma';
import { insertProductValidation, updateProductValidation } from '@/validation/product-validation';
import { validation } from '@/validation/validation';

export default function handler(req, res) {
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


async function put(req, res) {
  try {  
    const { id, ...validateRequest } = validation(updateProductValidation, req.body);
    await update({ table:"product", data:validateRequest, where: { id } })
    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: "OK"
    })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}

async function post(req, res) {
  try {
    
    const validateRequest = validation(insertProductValidation, req.body);
    await insert({ table: "product", data: validateRequest });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: "ok"
    })
  } catch (e) {
    responseErrorMessage(e, res);
  }
} 

async function get(req, res) {
  try {
    const query = req.query;
    let filters = {
      sql: "",
      values: []
    };
    const page = query?.page ? +query.page : 1;
    const skip = (page - 1) * OFFSET;
    
    if (query?.name) {
      filters.sql = `WHERE product.name = ? `;
      filters.values.push(query.name);
    }

    
    const paginationSql = `OFFSET ${skip} LIMIT ${OFFSET}`;
    const response = await query(`SELECT product.*, category.category_name FROM product 
      LEFT JOIN category ON category.id = product.id ${filters.sql} ORDER BY product.id DESC ${paginationSql}`, filters.values);
    
    // const response = await prismaClient.product.findMany({
    //   ...filters,
    //   include: {
    //     category: {
    //       select: {
    //         category_name: true
    //       }
    //     }
    //   },
    //   orderBy: {
    //     id:"desc"
    //   },
    //   skip,
    //   take: OFFSET
    // });

    

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
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}