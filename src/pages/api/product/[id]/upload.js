import { responseNotFound } from "@/errors/response-error";
import { DIR_FILE_PRODUCTS } from "@/lib/constant";
import { incomingRequest } from "@/lib/utils";
import fs from "fs";
import multiparty from "multiparty";
import { v4 as uuid } from "uuid";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      responseNotFound(res);
      return;
    }

    const multipartyForm = new multiparty.Form();
    const data = await incomingRequest(multipartyForm, req);
    const { files, path } = data;
    for (const key in files) {
      const file = files[key];
      const fileName = `${uuid().toString()}_${file.originalFilename}`;
      const srcFile = `${DIR_FILE_PRODUCTS}/${fileName}`;
      const contentData = await fs.promises.readFile(file.path);
      const levelBySlash = path.split("/").length - 2;

      // await prismaClient.product.create({
      //   data: {
      //     name: 
      //     level: path === "/" ? 0 : levelBySlash,
      //     path:path
      //   },  
      // })
      await fs.promises.writeFile(srcFile, contentData);
    }
  }catch(e){

  }
}