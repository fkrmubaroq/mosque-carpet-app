import Joi from "joi";

const createFolderValidation = Joi.object({
  name: Joi.string().max(255).required().pattern(/^[a-zA-Z0-9\-\_\!\@\#\$\%\^\&\*\(\)\s]+$/)
    .messages({
      "string.pattern.base": "Nama folder tidak valid",
      "string.max": "Nama folder terlalu panjang",
  }),
  path: Joi.string().max(255).required(),
})

const updateFolderNameValidation =  Joi.object({
  name: Joi.string().max(255).required().pattern(/^[a-zA-Z0-9\-\_\!\@\#\$\%\^\&\*\(\)\s]+$/)
    .messages({
      "string.pattern.base": "Nama folder tidak valid",
      "string.max": "Nama folder terlalu panjang",
  }).required(),
  path: Joi.string().max(255).required()
})
const updateFileNameValidation =  Joi.object({
  name: Joi.string().max(255).required()
    .messages({
      "string.pattern.base": "Nama file tidak valid",
      "string.max": "Nama file terlalu panjang",
    }).required(),
  path: Joi.string().max(255).required()
})
export {
  createFolderValidation, updateFileNameValidation, updateFolderNameValidation
};

