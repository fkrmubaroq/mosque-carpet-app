import { responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { DIR_FILE_UPLOAD } from "@/lib/constant";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    responseNotFound(res);
    return;
  }

  downloadFile(req, res);
}

async function downloadFile(req, res) {
  try {
    const { src } = req.query;
    const pathFile = `${DIR_FILE_UPLOAD}/${src.join("/")}`;
    const fileSync = fs.readFileSync(pathFile);
    const fileName = src?.[src.length - 1];
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-type', 'application/octet-stream');
    res.writeHead(200, { 'ContentType': "*" });
    const fileStream = fs.createReadStream(pathFile);
    fileStream.pipe(res);
    res.end(fileSync, "binary");

  } catch (e) {
    responseErrorMessage(e, res)
  }

}