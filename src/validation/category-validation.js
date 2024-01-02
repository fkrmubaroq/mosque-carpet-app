import Joi from "joi";
const insertCategoryValidation = Joi.object({
  category_name: Joi.string().max(100).required(),
});
const updateCategoryValidation = Joi.object({
  id: Joi.number().required(),
  category_name: Joi.string().max(100).default(""),
});

export { insertCategoryValidation, updateCategoryValidation };
