import { ResponseError, responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { createFile, unlinkFile } from "@/lib/api/utils";
import { DIR_FILE_THUMBNAIL } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { ERROR_MESSAGE } from "@/lib/message";
import { incomingRequest, slugString } from "@/lib/utils";
import Article from "@/models/article";
import { updateArticleValidation } from "@/validation/article-validation";
import { validation } from "@/validation/validation";
import multiparty from "multiparty";
import { v4 as uuid } from "uuid";

const article = new Article();
export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      getArticleById(req,res)
      break;
    case "PUT":
      updateArticle(req, res);
      break;
    case "DELETE":
      deleteArticle(req, res);
      break;
    default:
      responseNotFound(res);
      break;
  }
}

async function deleteArticle(req, res) {
  try {
    const { id } = req.query;

    const prevThumbnail = await article.findId(id);
    if (!prevThumbnail?.length) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.ArticleIsNotFound);
    }

    const resultPrev = prevThumbnail[0];

    if (resultPrev?.thumbnail) {
      const destinationFileUnlink = `${DIR_FILE_THUMBNAIL}/${resultPrev.thumbnail}`;
      await unlinkFile(destinationFileUnlink);
    }

    await article.deleteData({ id });

    res.status(200).json({ message: "ok" });
  } catch (e) {
    responseErrorMessage(e, res)
  } 
}

async function getArticleById(req, res) {
  try {
    const { id } = req.query;

    const data = await article.findId(id);
    if (!data?.length) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.ArticleIsNotFound);
    }

    res.status(200).json({ data })
  } catch (e) {
    responseErrorMessage(e, res)
  }
}

async function updateArticle(req, res) {
  try {
    const multipartyForm = new multiparty.Form();
    const { files, ...body } = await incomingRequest(multipartyForm, req);
    const { ...validateRequest } = validation(updateArticleValidation, body);
    const { id } = req.query;
    const updateData = { ...validateRequest };
    if (Object.keys(files).length) {
      const fileName = `${uuid().toString()}_${files?.thumbnail?.originalFilename}`;
      updateData.thumbnail = fileName;
      const prevImage = await article.findId(id);

      const resultPrev = prevImage?.[0];
      // when prev image is available, then unlink file and 
      if (prevImage?.length) {
        const destinationFileUnlink = `${DIR_FILE_THUMBNAIL}/${resultPrev.thumbnail}`;
        await unlinkFile(destinationFileUnlink);
      }
      const destinationCreateFile = `${DIR_FILE_THUMBNAIL}/${fileName}`;
      await createFile(files.thumbnail.path, destinationCreateFile);
    }

    const slug = slugString(updateData.title);

    updateData.slug = slug;
    const data = await article.updateData({ data: updateData, where: { id } });
    if (!data?.changedRows) {
      throw new ResponseError(STATUS_MESSAGE_ENUM.BadRequest, ERROR_MESSAGE.DataIsNotUpdated);
    }

    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data: "ok" });
  } catch (e) {
    responseErrorMessage(e, res)    
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}