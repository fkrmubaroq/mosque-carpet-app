import { responseErrorMessage, responseNotFound } from '@/errors/response-error';
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { prismaClient } from "@/lib/prisma";
import { updateSettingValidation } from "@/validation/setting-validation";
import { validation } from "@/validation/validation";

export default function handler(req, res) {
  switch (req.method) {
    case "PUT":
      put(req, res);
      break;
    case "GET":
      get(req, res);
      break;
    default:
      responseNotFound(res);
      break;
  }
}

async function put(req, res) {
  try {
    const { id, ...validateRequest } = validation(updateSettingValidation, req.body);
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