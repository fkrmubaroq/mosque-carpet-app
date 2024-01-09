import Joi from "joi";

const insertSettingValidation = Joi.object({
  id: Joi.number().required(),
  no_wa: Joi.string().max(20).required(),
  branch: Joi.string().required(),
  is_maintenance: Joi.string().max(1).required(),
  show_price: Joi.string().max(1).required(),
})

export {
  insertSettingValidation
};
