import Joi from "joi";

const updateSectionValidation = Joi.object({
  id: Joi.number().required(),
  section_name: Joi.string().required(),
  content: Joi.string().required(),
  position: Joi.number().required(),
  active: Joi.string().optional(),
})

export { updateSectionValidation };
