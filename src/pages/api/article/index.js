import { responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { DIR_FILE_THUMBNAIL } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { incomingRequest, slugString } from "@/lib/utils";
import Article from "@/models/article";
import { insertArticleValidation } from "@/validation/article-validation";
import { validation } from '@/validation/validation';
import fs from "fs";
import multiparty from "multiparty";
import { v4 as uuid } from "uuid";

const article = new Article();
export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    case "POST":
      post(req, res);
      break;
    default:
      responseNotFound(res);
      break;
  }
}

async function get(req, res) {
  try {
    const query = req.query;
    const data = await article.getArticleWithPagination(query)
    res.status(STATUS_MESSAGE_ENUM.Ok).json(data);
  } catch (e) {
    responseErrorMessage(e, res);
  }

}

async function post(req, res) {
  try {
    const multipartyForm = new multiparty.Form();
    const { files, ...body } = await incomingRequest(multipartyForm, req);
    const request = { ...body };
    if (Object.keys(files).length) {
      request.thumbnail = files.thumbnail
    }

    const validateRequest = validation(insertArticleValidation, request);
    const insertData = { ...validateRequest };
    const fileName = `${uuid().toString()}_${files?.thumbnail?.originalFilename}`;
    if (Object.keys(files).length) {
      insertData.thumbnail = fileName;
    }

    const slug = slugString(insertData.title);
    insertData.slug = slug;
    const data = await article.insertData(insertData);

    if (Object.keys(files).length) {
      const contentData = await fs.promises.readFile(files.thumbnail.path);
      const destination = `${DIR_FILE_THUMBNAIL}/${fileName}`;
      await fs.promises.writeFile(destination, contentData);
    }
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e) {
    responseErrorMessage(e, res)
  }

}

export const config = {
  api: {
    bodyParser: false
  }
}