import Joi from "joi";

type TLoginUserValidation = {
  username: string
  password: string
}
const loginUserValidation = Joi.object<TLoginUserValidation>({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required()
})

export type {
  TLoginUserValidation
}
export {
  loginUserValidation
};

