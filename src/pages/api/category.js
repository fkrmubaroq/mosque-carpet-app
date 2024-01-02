import { responseErrorMessage } from '@/errors/response-error';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import { prismaClient } from '@/lib/prisma';
 
export default function handler(req, res) {
  switch (req.method) {
    case "GET": getCategory(req,res)
  }
}
async function getCategory(req, res) {
  try { 
    const data = await prismaClient.category.findMany({});
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e) {
    responseErrorMessage(e, res);
  }
} 