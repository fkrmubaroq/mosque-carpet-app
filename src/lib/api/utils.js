import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { EXPIRED_DAYS } from "../constant";

export function hashPassword(string) {
  return bcrypt.hash(string, 10);
}

export function setHeaderCookie(token, res, expired=EXPIRED_DAYS) {
  const serialized = serialize("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: expired
  })
  res.setHeader("Set-Cookie", serialized);
}
