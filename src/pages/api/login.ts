import { ResponseError, responseErrorMessage } from '@/errors/response-error'
import { prismaClient } from '@/lib/prisma'
import { loginUserValidation } from '@/validation/user-validation'
import type { NextApiRequest, NextApiResponse } from 'next'
import { validation } from '@/validation/validation'
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { decodeJwt, encodeJwt } from '@/lib/jwt';
import { serialize } from 'cookie';
import { EXPIRED_DAYS } from '@/lib/constant'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      throw new ResponseError(401, "Username or password wrong");
    }
    const isPasswordValid = await bcrypt.compare(validateRequest.password, user.password);

    if (!isPasswordValid) {
      throw new ResponseError(401, "Username or password wrong");
    }
    
    const token = encodeJwt({ user: user.username });
    setTokenToHeaderCookie(token, res);
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


function setTokenToHeaderCookie(token: string, res: NextApiResponse) {
  const serialized = serialize("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: EXPIRED_DAYS
  })
  res.setHeader("Set-Cookie", serialized);
}