import Joi from "joi";

const updateSettingValidation = Joi.object({
  id: Joi.number().required(),
  no_wa: Joi.string().max(20).required(),
  ribbon: Joi.string().max(20).default("basic-primary"),
  link_address: Joi.string().optional(),
  is_maintenance: Joi.string().max(1).required(),
  show_price: Joi.string().max(1).required(),
})

export {
  updateSettingValidation
};
