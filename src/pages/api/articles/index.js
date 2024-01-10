import { responseErrorMessage, responseNotFound } from "@/errors/response-error";
import { STATUS_MESSAGE_ENUM } from "@/lib/enum";
import { prismaClient } from "@/lib/prisma";

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    default:
      responseNotFound(res);
      break;
  }
}

async function get(req, res) {
  try {
    const data = await prismaClient.article.findMany({
      include: {
        viewers: {
          select: {
            total: true,
          }
        }
      }
    });

    const parsedData = data.map(({ viewers, ...item }) => ({ ...item, total_viewers: viewers?.total || null }));
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data: parsedData })
  } catch (e) {
    responseErrorMessage(e, res);
  }

}