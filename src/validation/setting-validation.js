import Joi from "joi";

const updateSettingValidation = Joi.object({
  id: Joi.number().required(),
  no_wa: Joi.string().max(20).required(),
  is_maintenance: Joi.string().max(1).required(),
  show_price: Joi.string().max(1).required(),
  logo: Joi.string().max(255).optional(),
  logo_title: Joi.string().max(100).optional(),
  max_upload_file_size_in_mb: Joi.number().default(2).optional(),
  favicon: Joi.string().max(255).optional(),
  popup: Joi.string().optional(),
  ribbon: Joi.string().max(20).default("basic.primary"),
})

export {
  updateSettingValidation
};
