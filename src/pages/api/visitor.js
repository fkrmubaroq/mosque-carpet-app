import { responseNotFound } from "@/errors/response-error";

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

  
  res.status(200).json({ data: "ARTICLE" });

}