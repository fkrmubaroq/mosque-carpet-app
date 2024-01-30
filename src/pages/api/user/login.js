import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { decodeJwt } from "@/lib/jwt";
import { ERROR_MESSAGE } from "@/lib/message";
import { prismaClient } from "@/lib/prisma";
import { getCookieServer } from "@/lib/utils";

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
    const data = await prismaClient.user.findFirst({
      select: {
        username: true,
        name: true,
        role: true
      },
      where: {
        username: decode?.user
      }
    });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data });
  } catch (e) {
    console.log("eee",e)
    responseErrorMessage(e, res);
  }
}