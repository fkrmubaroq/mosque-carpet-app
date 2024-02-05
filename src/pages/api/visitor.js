import { responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { STATUS_MESSAGE_ENUM, TRACK_PAGE } from "@/lib/enum";
import Article from "@/models/article";
import Visitor from "@/models/visitor";

const visitor = new Visitor();
const article = new Article();
export default function handler(req, res) {
  if (req.method !== "POST") {
    responseNotFound(res);
    return;
  }

  trackVisitor(req, res);
}

function trackVisitor(req, res) {
  const payload = req.body;
  const isArticle = payload?.type === TRACK_PAGE.Article;
  if (isArticle) {
    return trackVisitorArticle(req, res);
  }
  trackVisitorLandingPage(req, res);
}


async function trackVisitorLandingPage(req, res) {
  try {
    const ipAddress = req.headers?.["x-ip-address"];
    if (!ipAddress) {
      res.status(STATUS_MESSAGE_ENUM.Ok).json({ message: "error track 2" });
      return;
    }

    const data = {
      ip_address: ipAddress,
      type: TRACK_PAGE.LandingPage,
    }

    const isAlreadyVisit = await visitor.isAlreadyVisitToday(TRACK_PAGE.LandingPage, ipAddress);
    if (isAlreadyVisit) {
      res.status(200).json({ message: "ok" });
      return;
    }


    await visitor.insertData(data);
    res.status(200).json({ message: "okay" });
  } catch (e) {
    responseErrorMessage(e, res);
  } 
}

async function trackVisitorArticle(req, res) {
  try {
    
  const { slug, type } = req.body;
  if (!slug) {
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ message: "error track 1" });
    return;
  }
  const ipAddress = req.headers?.["x-ip-address"];
  if (!ipAddress) {
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ message: "error track 2" });
    return;
  }

  const result = await article.articleContainSlug(slug);
  if (!result?.length) {
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ message: "error track 3" });
    return
  }

  const data = {
    ip_address: ipAddress,
    type,
    article_id: result[0]?.id
  };
  
  const isAlreadyVisit = await visitor.isAlreadyVisitToday(TRACK_PAGE.article, ipAddress, result[0]?.id);
  if (isAlreadyVisit) {
    res.status(200).json({ message: "ok" });
    return;
  }
  await visitor.insertData(data);
  res.status(200).json({ message:"okay" });
  } catch (e) {
    responseErrorMessage(e, res);
  }

}