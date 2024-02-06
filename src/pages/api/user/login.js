import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { decodeJwt } from "@/lib/jwt";
import { ERROR_MESSAGE } from "@/lib/message";
import { getCookieServer } from "@/lib/utils";
import User from "@/models/user";

const user = new User();
export default function handler(req, res) {
  if (req.method !== "GET") {
    responseNotFound(res);
    return;
  }

  get(req, res);
}

async function get(req, res) {
  try {
    const token = getCookieServer(req, "token");
    if (!token) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.Unauthorized)
    }
    const decode = decodeJwt(token);
    const data = await user.findByUsername(decode?.user);
    if (!data.length) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.UserNotFound)
    }
    const resultData = data[0];

    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: {
        username: resultData.username,
        role: resultData.role,
        name: resultData.name
    } });
  } catch (e) {
    responseErrorMessage(e, res);
  }
}