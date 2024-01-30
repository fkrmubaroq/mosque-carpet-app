import Joi from "joi";

const loginUserValidation = Joi.object({
  username: Joi.string().max(191).required(),
  password: Joi.string().max(100).required()
})

const insertUserValidation = Joi.object({
  username: Joi.string().max(191).required(),
  password: Joi.string().max(100).required(),
  role: Joi.string().max(15).required(),
  name: Joi.string().max(100).required()
})

const updateUserValidation = Joi.object({
  password: Joi.string().max(100).optional(),
  role: Joi.string().max(15).required(),
  name: Joi.string().max(100).required()
})
export {
  insertUserValidation, loginUserValidation, updateUserValidation
};

