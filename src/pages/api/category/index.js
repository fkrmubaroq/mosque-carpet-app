import { responseErrorMessage } from '@/errors/response-error';
import { OFFSET } from '@/lib/constant';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { prismaClient } from '@/lib/prisma';
import { insertCategoryValidation, updateCategoryValidation } from '@/validation/category-validation';
import { validation } from '@/validation/validation';
 
export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    case "POST":
      post(req, res);
      break;
    case "PUT":
      put(req, res);
      break;
  }
}
async function get(req, res) {
  try { 
    const query = req.query;
    let filters = {};
    const page = query?.page ? +query.page : 1;
    const skip = (page - 1) * OFFSET;
    if (query?.name) {
      filters = {
        where: {
          category_name: {
            contains: query.name
          }
        }
      }
    }

    const data = await prismaClient.category.findMany({
      ...filters,
      orderBy: {
        id: "desc"
      },
      skip,
      take: OFFSET
    });

    const paginationInfo = await prismaClient.category.count({
      ...filters
    });

    const totalPage = Math.ceil(paginationInfo / OFFSET)

    res.status(200).json({
      data,
      paging: {
        page,
        total_page: totalPage,
        total_items: paginationInfo
      }
    })
  } catch (e) {
    responseErrorMessage(e, res);
  }
} 
async function post(req, res) {
  try { 
    const validationRequest = validation(insertCategoryValidation, req.body);

    const data = await prismaClient.category.create({
      data: {
        category_name: validationRequest.category_name
      }
    });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e) {
    responseErrorMessage(e, res);
  }
} 
async function put(req, res) {
  try { 
    const { id, category_name } = validation(updateCategoryValidation, req.body);

    const data = await prismaClient.category.update({
      data: {
        category_name: category_name
      },
      where: {
        id:+id
      }
    });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e) {
    responseErrorMessage(e, res);
  }
} 
