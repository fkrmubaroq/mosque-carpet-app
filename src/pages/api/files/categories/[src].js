import { responseNotFound } from '@/errors/response-error';
import { DIR_FILE_CATEGORY } from '@/lib/constant';
import fs from "fs";
export default function handler(req, res) {
  const { src } = req.query;
  if (req.method !== "GET" || !src) {
    responseNotFound(res);
    return;
  }
  const pathFile = `${DIR_FILE_CATEGORY}/${src}`;
  console.log("path ", pathFile);

  const img = fs.readFileSync(pathFile);
  res.writeHead(200, { 'ContentType': "*" });
  res.end(img, 'binary');
}