import { responseErrorMessage, responseNotFound } from "@/errors/response-error";
import Article from "@/models/article";

const article = new Article();
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
    const data = await article.articleContainSlug(slug);
    res.status(200).json({ data: data?.[0] || {} });
  } catch (e) {
    responseErrorMessage(e, res);
  }
}