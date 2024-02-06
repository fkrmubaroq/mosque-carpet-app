import { serialize } from "cookie";
import fs from "fs";
import passwordHash from "password-hash";
import { EXPIRED_DAYS } from "../constant";

export function hashPassword(string) {
  return passwordHash.generate(string);
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

export function getCurrentDate() {
  const dateTime = new Date();

  const date = dateTime.getDate();
  const currentDate = date <= 9 ? `0${date}` : date;

  const month = +(dateTime.getMonth()) + 1;
  const currentMonth = month <= 9 ? `0${month}` : month;

  const currentYear = dateTime.getFullYear();
  return `${currentYear}-${currentMonth}-${currentDate}`;
}