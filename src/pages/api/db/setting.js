import { responseErrorMessage, responseNotFound } from '@/errors/response-error';
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { Setting } from '@/models/setting';
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
    const setting = new Setting();
    const data = await setting.update(validateRequest, { id });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}

async function get(req, res) {
  try {
    const setting = new Setting();
    const data = await setting.get();
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data: data?.[0] || {} })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}

