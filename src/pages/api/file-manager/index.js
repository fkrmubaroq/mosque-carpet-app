import { responseErrorMessage } from '@/errors/response-error';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { prismaClient } from '@/lib/prisma';
 
export default function handler(req, res) {
  switch (req.method) {
    case "GET": getAllFile(req, res); break;      
  }
}
async function getAllFile(req, res) {
  try {
    const query = req.query;
    const path = query?.path ? String(query?.path) : "/";
    const data = await prismaClient.fileManager.findMany({
      where: {
        path,
      },
      orderBy: [
        {
          type: "desc"
        }
      ]
    });
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e) {
    responseErrorMessage(e, res);
  }
} 