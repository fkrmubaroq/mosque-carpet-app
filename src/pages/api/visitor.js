import { responseNotFound } from "@/errors/response-error";
import { prismaClient } from "@/lib/prisma";

export default function handler(req, res) {
  if (req.method !== "GET") {
    responseNotFound(res);
    return;
  }

  trackVisitor(req, res);
}

function trackVisitor(req, res) {
  const { slug } = req.query;
  const isArticle = !!slug;
  if (isArticle) {
    return trackVisitorArticle(req, res, slug);
  }
  res.status(200).json({ data: "hehe" }); 
}

function trackVisitorArticle(req, res, slug) {
  
  const prismaVisitor = prismaClient.article.findFirst({
    where: {
      slug: {
        contains: slug
      }
    }
  });
  res.status(200).json({ data: prismaVisitor });

}