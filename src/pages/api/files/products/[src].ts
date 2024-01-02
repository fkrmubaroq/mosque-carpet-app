import { responseNotFound } from '@/errors/response-error';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from "fs";
import { DIR_FILE_PRODUCTS, DIR_FILE_UPLOAD } from '@/lib/constant';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { src } = req.query;
  if (req.method !== "GET" || !src) {
    responseNotFound(res);
    return;
  }
  const pathFile = `${DIR_FILE_PRODUCTS}/${src}`;
  console.log("path ", pathFile);
  
  const img = fs.readFileSync(pathFile);
  res.writeHead(200, {'ContentType': "*" });
  res.end(img, 'binary');
}