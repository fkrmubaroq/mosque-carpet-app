import { TProductForm } from "@/components/features/products/ModalForm";
import Joi from "joi";

const insertProductValidation = Joi.object<TProductForm>({
  name: Joi.string().max(255).required(),
  description: Joi.string().optional().allow(""),
  price: Joi.number().optional().empty('').default(0),
  stock: Joi.number().optional().empty('').default(0),
  category_id: Joi.number().required(),
  image: Joi.string().max(255).optional(),
  active: Joi.string().max(1).optional()

})
const updateProductValidation = Joi.object<TProductForm>({
  id: Joi.number().required(),
  name: Joi.string().max(255).optional(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().optional().empty('').default(0),
  stock: Joi.number().optional().empty('').default(0),
  category_id: Joi.number().optional(),
  image: Joi.string().max(255).optional(),
  active: Joi.string().max(1).optional()
}) 

const updateStatusValidation = Joi.number().required()

export {
  insertProductValidation,
  updateProductValidation,
  updateStatusValidation
};

