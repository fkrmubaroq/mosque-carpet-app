import { ResponseError, responseErrorMessage } from "@/errors/response-error";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import Section from "@/models/section";
import { updateSectionValidation } from "@/validation/section-validation";
import { validation } from "@/validation/validation";

const section = new Section();
export default function handler(req, res) {
  switch (req.method) {
    case "PUT":
      put(req, res);
      break;
    case "GET":
      get(req, res);
      break;
  }
}

async function get(req, res) {
  try {
    const queryParams = req?.query;
    const data = await section.getAll(queryParams);
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data });
  } catch (e) {
    responseErrorMessage(e, res);
  } 
}

async function put(req, res) {
  try {
    const sections = req.body?.sections;
    if (!sections?.length) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.SectionIsNull);
    }

    for (let i = 0; i < sections.length; i++){
      const {id, ...requestValidate } = validation(updateSectionValidation, sections[i]);
      await section.updateData({ data: requestValidate, where: { id } });
    }


    res.status(STATUS_MESSAGE_ENUM.Ok).json({ message: "ok" })
  } catch (e) {
    responseErrorMessage(e, res);
  }
} 
