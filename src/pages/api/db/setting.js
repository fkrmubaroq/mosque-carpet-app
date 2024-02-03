import { responseErrorMessage, responseNotFound } from '@/errors/response-error';
import query, { update } from '@/lib/db';
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { prismaClient } from "@/lib/prisma";
import { updateSettingValidation } from "@/validation/setting-validation";
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
    const { id, ...validateRequest } = validation(updateSettingValidation, req.body);
    const results = await query("UPDATE setting SET "); 
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
    const data = {
      username: "saenahowx",
    }
    const where = {
      username: "saenahow",
    }
    await update({
      table: "user",
      data,
      where
    });
    // const data = await prismaClient.setting.findFirst();
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data:"" })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}