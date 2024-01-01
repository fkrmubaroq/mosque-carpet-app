import { TFolderForm } from "@/components/features/file-manager/ModalForm";
import Joi from "joi";

const createFolderValidation = Joi.object<TFolderForm>({
  name: Joi.string().max(255).required().pattern(/^[a-zA-Z0-9\-\_\!\@\#\$\%\^\&\*\(\)\s]+$/)
    .messages({
      "string.pattern.base": "Nama folder tidak valid",
      "string.max": "Nama folder terlalu panjang",
  }),
  path: Joi.string().max(255).required(),
})

const updateFolderNameValidation =  Joi.object<TFolderForm>({
  name: Joi.string().max(255).required().pattern(/^[a-zA-Z0-9\-\_\!\@\#\$\%\^\&\*\(\)\s]+$/)
    .messages({
      "string.pattern.base": "Nama folder tidak valid",
      "string.max": "Nama folder terlalu panjang",
  }).required(),
})
export {
  createFolderValidation,
  updateFolderNameValidation
}