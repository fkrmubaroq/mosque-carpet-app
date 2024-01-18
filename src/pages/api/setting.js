import { responseErrorMessage, responseNotFound } from '@/errors/response-error';
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { prismaClient } from "@/lib/prisma";
import { insertSettingValidation } from "@/validation/setting-validation";
import { validation } from "@/validation/validation";

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      post(req, res);
      break;
    case "GET":
      get(req, res);
      break;
    default:
      responseNotFound(res);
      break;
  }
}

async function post(req, res) {
  try {
    const { id, ...validateRequest } = validation(insertSettingValidation, req.body);
    const data = await prismaClient.setting.update({
      data: validateRequest,
      where: {
        id
      }
    });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}

async function get(req, res) {
  try {
    const data = await prismaClient.setting.findFirst();
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e) {
    responseErrorMessage(e, res);    
  }
}