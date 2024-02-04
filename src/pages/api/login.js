import { ResponseError, responseErrorMessage } from '@/errors/response-error'
import { setHeaderCookie } from '@/lib/api/utils'
import { STATUS_MESSAGE_ENUM } from '@/lib/enum'
import { encodeJwt } from '@/lib/jwt'
import { ERROR_MESSAGE } from '@/lib/message'
import User from '@/models/user'
import { loginUserValidation } from '@/validation/user-validation'
import { validation } from '@/validation/validation'
import bcrypt from "bcrypt"

const user = new User();
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return;
    }
    const validateRequest = validation(loginUserValidation, req.body);
    const username = validateRequest.username;
    const findUsername = await user.findByUsername(username);
    if (!findUsername?.length) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.Unauthorized, ERROR_MESSAGE.UsernameOrPasswordWrong);
    }

    const resultFind = findUsername[0];
    const isPasswordValid = await bcrypt.compare(validateRequest.password, resultFind.password);

    if (!isPasswordValid) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.Unauthorized, ERROR_MESSAGE.UsernameOrPasswordWrong);
    }

    const token = await encodeJwt({ user: resultFind.username });

    setHeaderCookie(token, res);
    res.status(200).json({
      data: {
        username: resultFind.username,
        name: resultFind.name
      }
    });

  } catch (e) {
    responseErrorMessage(e, res);
  }

}
