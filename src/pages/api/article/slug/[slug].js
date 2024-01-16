import { responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { prismaClient } from "@/lib/prisma";

export default function handler(req, res) {
  if (req.method !== "GET") {
    responseNotFound(res);
    return;
  }

  getArticleBySlug(req, res);
}

async function getArticleBySlug(req, res) {
  try {
    const { slug } = req.query;
    const data = await prismaClient.article.findFirst({
      where: {
        slug: {
          contains: slug
        }
      }
    });
    res.status(200).json({ data });
  } catch (e) {
    responseErrorMessage(e, res);
  }
}