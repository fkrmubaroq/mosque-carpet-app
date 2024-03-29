import { ResponseError } from "@/errors/response-error";
import jwt from "jsonwebtoken";
import { EXPIRED_DAYS } from "./constant";
const secret = process.env.JWT_SECRET_KEY || ""

export function decodeJwt(token) {
  if (!token) {
    throw new ResponseError(401, "Unauthorized");
  }
  
  return jwt.verify(token, secret);
}

export function encodeJwt(payload) {
  return new Promise((resolve) => {
    jwt.sign(payload, secret, { expiresIn: EXPIRED_DAYS }, (err, token) => {
      if (err) {
        resolve(err);
        return;
      };
      resolve(token);
    });
  });
}