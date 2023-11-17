import { ResponseError } from "@/errors/response-error";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import Joi from "joi";

export function validation<TSchema, TData>(schema:Joi.ObjectSchema<TSchema> | Joi.NumberSchema<TSchema> , data:TData) {
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
