import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { hashPassword } from "@/lib/api/utils";
import { count } from "@/lib/db";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import User from "@/models/user";
import { insertUserValidation } from "@/validation/user-validation";
import { validation } from "@/validation/validation";

const user = new User();
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
    const usernameIsExists = await count(`SELECT user.username FROM user WHERE username = ?`, [validateRequest.username]);

    if (usernameIsExists) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.UserIsAlreadyExists)
    }
    
    const password = await hashPassword(validateRequest.password);
    validateRequest.password = password;

    await user.insertData(validateRequest);

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
    const data = await user.getProductWithPagination(query, req);

    res.status(STATUS_MESSAGE_ENUM.Ok).json(data);
  } catch (e) {
    responseErrorMessage(e, res);
  }

}