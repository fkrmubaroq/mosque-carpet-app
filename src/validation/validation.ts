import { ResponseError } from "@/errors/response-error";
import Joi from "joi";

export function validation<TSchema, TData>(schema:Joi.ObjectSchema<TSchema> | Joi.NumberSchema<TSchema> , data:TData) {
  const validate = schema.validate(data, {
      abortEarly: false,
      allowUnknown: false
  });
  if (validate.error) {
    throw new ResponseError(400,validate.error.message); 
  }

  return validate.value
}
