import { responseErrorMessage, responseNotFound } from '@/errors/response-error';
import { DIR_FILE_UPLOAD } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { incomingRequest } from "@/lib/utils";
import FileManager from '@/models/file';
import fs from "fs";
import multiparty from "multiparty";

const fileManager = new FileManager();
function renameFileDuplicated(fileName, text) {
  const splitFileName = fileName.split(".");
  splitFileName.splice(splitFileName.length - 1, 0, text);
  return splitFileName.join(".")
}

async function insertFileToServerAndDatabase(data) {
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
            path,
            size: file.size
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
              path,
              size: file.size
            })
            await fs.promises.writeFile(srcFile, contentData);
            resolve(true);
            return;
          }

          const count = await fileManager.countFileContains(fileName);

          const renamefileName = renameFileDuplicated(fileName, `${(count + 2)}`);
          srcFile = `${pathDir}${renamefileName}`;
          await insertFileInfoToDatabase({
            name: renamefileName,
            path,
            size: file.size
          })
          await fs.promises.writeFile(srcFile, contentData);
          resolve(true);
        })
      })
    }
  })
}

async function insertFileInfoToDatabase({ name, path, size }) {
  const levelBySlash = path.split("/").length - 2;
  const data = {
    type: "FILE",
    name,
    level: path === "/" ? 0 : levelBySlash,
    path: path,
    size
  };
  await fileManager.insertData(data);
}

export default async function handler(req, res) {
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