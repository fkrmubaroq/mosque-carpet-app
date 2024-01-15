import { responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { DIR_FILE_THUMBNAIL } from "@/lib/constant";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { prismaClient } from "@/lib/prisma";
import { createFile, incomingRequest, slugString, unlinkFile } from "@/lib/utils";
import { updateArticleValidation } from "@/validation/article-validation";
import { validation } from "@/validation/validation";
import multiparty from "multiparty";
import { v4 as uuid } from "uuid";


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

    const prevThumbnail = await prismaClient.article.findFirst({
      where: {
        id: +id
      },
    });  
    if (prevThumbnail?.thumbnail) {
      const destinationFileUnlink = `${DIR_FILE_THUMBNAIL}/${prevThumbnail.thumbnail}`;
      await unlinkFile(destinationFileUnlink);
    }

    await prismaClient.article.delete({
      where: {
        id: +id
      }
    });

    res.status(200).json({ message: "ok" });
  } catch (e) {
    responseErrorMessage(e, res)
  } 
}

async function getArticleById(req, res) {
  try {
    const { id } = req.query;

    const data = await prismaClient.article.findFirst({
      where: {
        id: +id
      }
    });

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
      const prevImage = await prismaClient.article.findFirst({
        where: {
          id: +id
        },
      });


      // when prev image is available, then unlink file and 
      if (prevImage) {
        const destinationFileUnlink = `${DIR_FILE_THUMBNAIL}/${prevImage.thumbnail}`;
        await unlinkFile(destinationFileUnlink);
      }
      const destinationCreateFile = `${DIR_FILE_THUMBNAIL}/${fileName}`;
      await createFile(files.thumbnail.path, destinationCreateFile);

    }

    const slug = slugString(updateData.title);

    updateData.slug = slug;
    const data = await prismaClient.article.update({
      data: updateData,
      where: {
        id: +id
      }
    });
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