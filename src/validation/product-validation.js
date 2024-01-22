import Joi from "joi";

const insertProductValidation = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().optional().allow(""),
  price: Joi.number().optional().empty('').default(0),
  stock: Joi.number().optional().empty('').default(0),
  category_id: Joi.number().required(),
  image: Joi.string().optional(),
  discount: Joi.number().default(0),
  active: Joi.string().max(1).optional()

})
const updateProductValidation = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().max(255).optional(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().optional().empty('').default(0),
  stock: Joi.number().optional().empty('').default(0),
  category_id: Joi.number().optional(),
  image: Joi.string().optional(),
  discount: Joi.number().default(0),
  active: Joi.string().max(1).optional()
}) 

const updateStatusValidation = Joi.number().required()

export {
  insertProductValidation,
  updateProductValidation,
  updateStatusValidation
};

