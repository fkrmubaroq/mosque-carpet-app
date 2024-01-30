import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { OFFSET } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import { prismaClient } from "@/lib/prisma";
import { insertUserValidation } from "@/validation/user-validation";
import { validation } from "@/validation/validation";

export default function handler(req, res) {
  switch (req.method) {
    case "GET": 
      get(req, res);
      break;
    case "POST":
      post(req, res);
      break;
    default:
      responseNotFound(res);
    break;
  }
}

async function post(req, res) {
  try {
    const validateRequest = validation(insertUserValidation, req.body);
    const usernameIsExists = await prismaClient.user.count({
      where: {
        username: validateRequest.username
      }
    });
    if (usernameIsExists) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.UserIsAlreadyExists)
    }
    const insertUser = await prismaClient.user.create({
      data: validateRequest
    });

    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: insertUser
    })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}

async function get(req, res) {
  try {
    const query = req.query;
    const q = query?.q;
    const page = query?.page ? +query.page : 1;
    const skip = (page - 1) * OFFSET;
    const role = query?.role;
    let filters = {
      where: {}
    };
    if (role) {
      filters.where.role = role
    }

    if (q) {
      filters.where.OR = [
        {
          username: {
            contains: q,
          }
        },
        {
          name: {
            contains: q
          }
        }
      ]
    }


    const data = await prismaClient.user.findMany({
      select: {
        username: true,
        name: true,
        role: true
      },
      ...filters,
      skip,
      take: +(query?.limit) || OFFSET,
    });

    const paginationInfo = await prismaClient.user.count({
      ...filters
    });
    const totalPage = Math.ceil(paginationInfo / OFFSET)

    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: data,
      paging: {
        page,
        total_page: totalPage,
        total_items: paginationInfo
      }
    })
  } catch (e) {
    console.log("e", e);
    responseErrorMessage(e, res);
  }

}