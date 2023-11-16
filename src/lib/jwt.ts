import jwt from "jsonwebtoken";
import { ResponseError } from "@/errors/response-error";
import { NextRequest } from "next/server";
import { EXPIRED_DAYS } from "./constant";
const secret = process.env.JWT_SECRET_KEY || ""

export function decodeJwt(token: string | undefined) {
  if (!token) {
    throw new ResponseError(401, "Unauthorized");
  }
  
  return jwt.verify(token, secret);
}

export function encodeJwt(data: any) {
  return jwt.sign(data, secret, { expiresIn: EXPIRED_DAYS });

}