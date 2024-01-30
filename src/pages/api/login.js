import { ResponseError, responseErrorMessage } from '@/errors/response-error'
import { setHeaderCookie } from '@/lib/api/utils'
import { STATUS_MESSAGE_ENUM } from '@/lib/enum'
import { encodeJwt } from '@/lib/jwt'
import { ERROR_MESSAGE } from '@/lib/message'
import { prismaClient } from '@/lib/prisma'
import { loginUserValidation } from '@/validation/user-validation'
import { validation } from '@/validation/validation'
import bcrypt from "bcrypt"

export default async function handler(req, res) {
  try {  
    if (req.method !== "POST") {
      return;
    }
    const validateRequest = validation(loginUserValidation, req.body);
    const username = validateRequest.username;
    const user = await prismaClient.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        password: true,
        name: true
      }
    });
    
    if (!user) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.Unauthorized, ERROR_MESSAGE.UsernameOrPasswordWrong);
    }
    const isPasswordValid = await bcrypt.compare(validateRequest.password, user.password);

    if (!isPasswordValid) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.Unauthorized, ERROR_MESSAGE.UsernameOrPasswordWrong);
    }
    
    const token = await encodeJwt({ user: user.username });

    setHeaderCookie(token, res);
    res.status(200).json({
      data: {
        username: user.username,
        name: user.name
      }
    });
    
  } catch (e) {
    responseErrorMessage(e, res);
  }

}
