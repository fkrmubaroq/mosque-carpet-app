import { responseNotFound } from '@/errors/response-error';
import { DIR_FILE_UPLOAD } from '@/lib/constant';
import fs from "fs";
export default function handler(req, res) {
  const { src } = req.query;
  if (req.method !== "GET" || !src) {
    responseNotFound(res);
    return;
  }
  const pathFile = `${DIR_FILE_UPLOAD}/${(src).join("/")}`;
  const img = fs.readFileSync(pathFile);
  res.writeHead(200, {'Content-Type': "image/*" });
  res.end(img, 'binary');
}