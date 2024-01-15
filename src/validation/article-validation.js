import Joi from "joi";
const insertArticleValidation = Joi.object({
  content: Joi.string().required(),
  thumbnail: Joi.object().required(),
  title: Joi.string().max(191).required(),
  writer: Joi.string().max(191).required(),
});

const updateArticleValidation = Joi.object({
  content: Joi.string().optional(),
  thumbnail: Joi.object().optional(),
  title: Joi.string().max(191).optional(),
  writer: Joi.string().max(191).optional(),
});


export { insertArticleValidation, updateArticleValidation };
