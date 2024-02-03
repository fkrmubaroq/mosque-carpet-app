import { responseErrorMessage, responseNotFound } from '@/errors/response-error';
import query, { update } from '@/lib/db';
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { updateSettingValidation } from "@/validation/setting-validation";
import { validation } from "@/validation/validation";
import { QueryTypes } from 'sequelize';

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
    const data = await update({ table: "setting", data: validateRequest, where: { id } });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}

async function get(req, res) {
  try {
    await query("SELECT * FROM setting LIMIT 1",{ type: QueryTypes.SELECT });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ message:"ok" })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}

