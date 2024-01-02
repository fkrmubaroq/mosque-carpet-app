import { ResponseError } from "@/errors/response-error";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";

export function validation(schema , data) {
  const validate = schema.validate(data, {
      abortEarly: false,
      allowUnknown: false
  });
  if (validate.error) {
    throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, {
      code: 1,
      message: validate.error.message
    }); 
  }

  return validate.value
}
