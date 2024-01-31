import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { hashPassword } from "@/lib/api/utils";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import { updateUserValidation } from "@/validation/user-validation";
import { validation } from "@/validation/validation";

export default function handler(req, res) {
  switch (req.method) {
    case "DELETE":
      deleteUser(req, res);
      break;
    case "PUT":
      updateUser(req, res);
      break;
    default: responseNotFound(res);
  }
}

async function deleteUser(req, res) {
  try {
    const { username } = req.query;

    await prismaClient.user.delete({
      where: {
        username: username
      },
    });

    res.status(200).json({ message: "ok" });
  } catch (e) {
    responseErrorMessage(e, res)
  }
}

async function updateUser(req, res) {
  try {
    const { username } = req.query;
    const validateRequest = validation(updateUserValidation, req.body);
    const foundUser = await prismaClient.user.count({
      where: {
        username: validateRequest.username
      }
    });
    if (!foundUser) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.UserNotFound)
    }

    if (validateRequest?.password) {
      const password = await hashPassword(validateRequest.password);
      validateRequest.password =  password;
    }
    await prismaClient.user.update({
      data: validateRequest,
      where: {
        username: username
      },
    });

    res.status(200).json({ message: "ok", data: validateRequest });
  } catch (e) {
    responseErrorMessage(e, res)
  }
}