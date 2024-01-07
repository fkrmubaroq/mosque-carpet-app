import { responseNotFound } from '@/errors/response-error';
import { DIR_FILE_PRODUCTS } from '@/lib/constant';
import fs from "fs";
export default function handler(req, res) {
  const { src } = req.query;
  if (req.method !== "GET" || !src) {
    responseNotFound(res);
    return;
  }
  const pathFile = `${DIR_FILE_PRODUCTS}/${src}`;
  
  const img = fs.readFileSync(pathFile);
  res.writeHead(200, {'ContentType': "*" });
  res.end(img, 'binary');
}