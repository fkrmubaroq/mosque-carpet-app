import { NextApiRequest, NextApiResponse } from "next";
import { responseErrorMessage, responseNotFound } from '@/errors/response-error';
import multiparty from "multiparty";
import fs from "fs";
import { DIR_FILE_UPLOAD } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { prismaClient } from "@/lib/prisma";
import { incomingRequest } from "@/lib/utils";

type TFile = {
  fieldName: string;
    originalFilename: string
    path: string
    headers: object,
    size: string
}


function renameFileDuplicated(fileName: string, text: string) {
  const splitFileName: string[] = fileName.split(".");
  splitFileName.splice(splitFileName.length - 1, 0, text);
  return splitFileName.join(".")
}

async function insertFileToServerAndDatabase(data: any) {
  const { files, path } = data;
  return new Promise(async (resolve) => {
  const pathDir = `${DIR_FILE_UPLOAD}${data.path}`;
    for (const key in files) {
      const file = files[key];
      let srcFile = `${pathDir}${file.originalFilename}`;
      const contentData = await fs.promises.readFile(file.path);

      fs.access(srcFile, async (err) => {
        // when file is not exists, create file and then move into files/upload/
        if (err) {
          await insertFileInfoToDatabase({
            name: file.originalFilename,
            path
          })
          await fs.promises.writeFile(srcFile, contentData);
          resolve(true);
          return;
        }

        // when file is exists, rename file 'copy(n+1)'
        const fileName = renameFileDuplicated(file.originalFilename, "copy");
        srcFile = `${pathDir}${fileName}`;
        fs.access(srcFile, async (err) => {
          if (err) {
            await insertFileInfoToDatabase({
              name: fileName,
              path
            })
            await fs.promises.writeFile(srcFile, contentData);
            resolve(true);
            return;
          }

          const count = await prismaClient.fileManager.count({
            where: {
              path,
              name: {
                startsWith: fileName
              }
            }
          });
          const renamefileName = renameFileDuplicated(fileName, `${(count + 2)}`);
          srcFile = `${pathDir}${renamefileName}`;
          await insertFileInfoToDatabase({
            name: renamefileName,
            path
          })
          await fs.promises.writeFile(srcFile, contentData);
          resolve(true);
        })
      })
    }
  })
}

async function insertFileInfoToDatabase({ name, path }: { name: string; path: string }) {
  const levelBySlash = path.split("/").length - 2;
  await prismaClient.fileManager.create({
    data: {
      type: "FILE",
      name,
      level: path === "/" ? 0 : levelBySlash,
      path:path
    },  
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      responseNotFound(res);
      return;
    }
    const multipartyForm = new multiparty.Form();
    const data = await incomingRequest(multipartyForm, req);
    
    await insertFileToServerAndDatabase(data);
   
    res.status(STATUS_MESSAGE_ENUM.Ok).json({
      data: "ok"
    })
  } catch (e) {
    responseErrorMessage(e, res);
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}