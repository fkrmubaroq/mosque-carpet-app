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


export async function fileIsExists(src) {
  return new Promise((resolve, reject) => {
    fs.access(src, async (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    })
  })
}

export async function unlinkFile(src) {
  return new Promise((resolve) => {
    fs.access(src, async (err) => {
      if (err) {
        resolve(false);
        return;
      }
      await fs.promises.unlink(src);
      resolve(true);
    });
  });
}

export async function createFile(src, destination) {
  const contentData = await fs.promises.readFile(src);
  await fs.promises.writeFile(destination, contentData);
}